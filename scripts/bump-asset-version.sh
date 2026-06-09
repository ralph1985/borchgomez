#!/bin/sh
set -eu

INDEX_FILE="index.html"
SUPPORTED_EXTENSIONS="css|js|png|jpg|jpeg|svg|webp|gif|ico|webmanifest|woff|woff2|ttf"

if [ ! -f "$INDEX_FILE" ]; then
  echo "No se encuentra $INDEX_FILE" >&2
  exit 1
fi

if command -v shasum >/dev/null 2>&1; then
  hash_file() {
    shasum -a 256 "$1" | awk '{print $1}'
  }
elif command -v sha256sum >/dev/null 2>&1; then
  hash_file() {
    sha256sum "$1" | awk '{print $1}'
  }
else
  echo "No se encuentra shasum ni sha256sum para calcular hashes de assets." >&2
  exit 1
fi

ASSET_LIST="$(mktemp)"
ASSET_HASHES="$(mktemp)"
UPDATED_INDEX="$(mktemp)"

cleanup() {
  rm -f "$ASSET_LIST" "$ASSET_HASHES" "$UPDATED_INDEX"
}
trap cleanup EXIT HUP INT TERM

perl -0ne '
  use strict;
  use warnings;

  my $extensions = qr/\.(?:'"$SUPPORTED_EXTENSIONS"')\z/i;
  my %seen;

  sub asset_key {
    my ($url) = @_;
    $url =~ s/^\s+|\s+$//g;

    return if $url eq "";
    return if $url =~ m{^(?:[a-z][a-z0-9+.-]*:|//|#)}i;

    my ($path) = split /[?#]/, $url, 2;
    return if !defined $path || $path eq "";
    return if $path !~ $extensions;

    $path =~ s{^\./}{};
    $path =~ s{^/}{};
    $path =~ s{//+}{/}g;

    return $path;
  }

  s/<!--.*?-->//gs;

  while (/\b(?:src|href|content)\s*=\s*(["\x27])([^"\x27<>]+)\1/gi) {
    my $key = asset_key($2);
    print "$key\n" if defined $key && !$seen{$key}++;
  }

  while (/\bsrcset\s*=\s*(["\x27])([^"\x27<>]+)\1/gi) {
    for my $entry (split /,/, $2) {
      $entry =~ s/^\s+|\s+$//g;
      my ($url) = split /\s+/, $entry, 2;
      my $key = asset_key($url);
      print "$key\n" if defined $key && !$seen{$key}++;
    }
  }
' "$INDEX_FILE" > "$ASSET_LIST"

while IFS= read -r asset_path; do
  [ -n "$asset_path" ] || continue

  if [ ! -f "$asset_path" ]; then
    echo "Aviso: referencia local a asset inexistente: $asset_path" >&2
    continue
  fi

  asset_hash="$(hash_file "$asset_path" | cut -c 1-8)"
  printf '%s\t%s\n' "$asset_path" "$asset_hash" >> "$ASSET_HASHES"
done < "$ASSET_LIST"

perl -0e '
  use strict;
  use warnings;

  my ($hash_file, $index_file) = @ARGV;
  my %asset_hash;
  my $extensions = qr/\.(?:'"$SUPPORTED_EXTENSIONS"')\z/i;

  open my $hashes, "<", $hash_file or die "No se puede leer $hash_file: $!";
  {
    local $/ = "\n";
    while (my $line = <$hashes>) {
      chomp $line;
      my ($asset, $hash) = split /\t/, $line, 2;
      next if !defined $asset || !defined $hash;
      $asset_hash{$asset} = $hash;
    }
  }
  close $hashes;

  open my $html_file, "<", $index_file or die "No se puede leer $index_file: $!";
  local $/;
  my $html = <$html_file>;
  close $html_file;

  sub asset_key {
    my ($url) = @_;
    $url =~ s/^\s+|\s+$//g;

    return if $url eq "";
    return if $url =~ m{^(?:[a-z][a-z0-9+.-]*:|//|#)}i;

    my ($path) = split /[?#]/, $url, 2;
    return if !defined $path || $path eq "";
    return if $path !~ $extensions;

    $path =~ s{^\./}{};
    $path =~ s{^/}{};
    $path =~ s{//+}{/}g;

    return $path;
  }

  sub version_url {
    my ($url) = @_;
    my $key = asset_key($url);
    return $url if !defined $key || !exists $asset_hash{$key};

    my ($path, $query, $fragment) = $url =~ /\A([^?#]*)(\?[^#]*)?(#.*)?\z/;
    $query = "" if !defined $query;
    $fragment = "" if !defined $fragment;

    my $hash = $asset_hash{$key};

    if ($query eq "") {
      $query = "?v=$hash";
    } else {
      $query =~ s/^\?//;
      if ($query =~ /(?:^|&)v=/) {
        $query =~ s/(^|&)v=[^&]*/$1v=$hash/;
      } else {
        $query .= "&v=$hash";
      }
      $query = "?$query";
    }

    return $path . $query . $fragment;
  }

  sub version_srcset {
    my ($srcset) = @_;
    my @parts = split /(\s*,\s*)/, $srcset;

    for (my $i = 0; $i < @parts; $i += 2) {
      $parts[$i] =~ s{\A(\s*)(\S+)(.*)\z}{$1 . version_url($2) . $3}es;
    }

    return join "", @parts;
  }

  my @segments = split /(<!--.*?-->)/s, $html;

  for my $segment (@segments) {
    next if $segment =~ /\A<!--/s;

    $segment =~ s{(\b(?:src|href|content)\s*=\s*)(["\x27])([^"\x27<>]*)(\2)}{$1 . $2 . version_url($3) . $4}egi;
    $segment =~ s{(\bsrcset\s*=\s*)(["\x27])([^"\x27<>]*)(\2)}{$1 . $2 . version_srcset($3) . $4}egi;
  }

  print join "", @segments;
' "$ASSET_HASHES" "$INDEX_FILE" > "$UPDATED_INDEX"

if cmp -s "$INDEX_FILE" "$UPDATED_INDEX"; then
  echo "Las versiones de assets ya estan actualizadas."
else
  mv "$UPDATED_INDEX" "$INDEX_FILE"
  echo "Versiones de assets actualizadas por hash de contenido en $INDEX_FILE."
fi
