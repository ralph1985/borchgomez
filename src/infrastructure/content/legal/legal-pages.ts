import type { LegalData, LegalPageContent } from "../../../domain/legal";

type LegalPageKey = "aviso-legal" | "politica-privacidad" | "politica-cookies";

const currentDate = "18 de julio de 2026";

export function getLegalPage(key: LegalPageKey, legalData: LegalData): LegalPageContent {
  const pages = createLegalPages(legalData);

  return pages[key];
}

function createLegalPages(legalData: LegalData): Record<LegalPageKey, LegalPageContent> {
  const owner = legalData.fullName;
  const brand = legalData.commercialName;
  const contact = `${legalData.email} · ${legalData.phone}`;

  return {
    "aviso-legal": {
      slug: "aviso-legal",
      title: "Aviso Legal",
      description: `Información legal de ${brand}: titularidad, condiciones de uso, propiedad intelectual y enlaces externos.`,
      updatedAt: currentDate,
      sections: [
        {
          title: "Datos identificativos",
          list: [
            `Titular: ${owner}`,
            `Nombre comercial: ${brand}`,
            `NIF: ${legalData.nif}`,
            `Domicilio: ${legalData.address}`,
            `Dominio: ${legalData.domain}`,
            `Email: ${legalData.email}`,
            `Teléfono: ${legalData.phone}`,
          ],
        },
        {
          title: "Objeto del sitio web",
          paragraphs: [
            `Este sitio web presenta la actividad profesional de ${brand}, centrada en producción audiovisual, fotografía, drone, contenido digital, presencia online y servicios relacionados para negocios rurales, productores, alojamientos, restaurantes, municipios y proyectos locales.`,
            "La web tiene finalidad informativa y de contacto. No dispone de área privada, registro de usuarios, comercio electrónico, pasarela de pago, comentarios, descargas cerradas ni contratación automatizada desde la propia página.",
          ],
        },
        {
          title: "Condiciones de uso",
          paragraphs: [
            "La persona que navega por este sitio se compromete a utilizarlo de forma lícita, respetuosa y conforme a la normativa aplicable, sin dañar su funcionamiento ni impedir el uso normal por otras personas.",
            "Los contenidos se ofrecen con carácter informativo. Pueden actualizarse para reflejar cambios en los servicios, trabajos publicados, datos de contacto o funcionamiento técnico de la web.",
          ],
        },
        {
          title: "Propiedad intelectual e industrial",
          paragraphs: [
            `Salvo indicación contraria, los textos, diseño, estructura, logotipos, fotografías, vídeos, código y demás elementos de la web pertenecen a ${owner} o se utilizan con autorización, licencia o cobertura suficiente para su publicación.`,
            "No se permite reproducir, distribuir, transformar, comunicar públicamente ni reutilizar los contenidos con fines comerciales sin autorización previa y expresa de su titular.",
          ],
        },
        {
          title: "Enlaces externos",
          paragraphs: [
            "La web incluye enlaces a servicios externos como WhatsApp, Instagram, TikTok y Facebook, y enlaces a publicaciones de Instagram relacionadas con proyectos. Al abrir esos enlaces, la navegación pasa a sitios gestionados por terceros y sujetos a sus propias condiciones y políticas.",
            `${brand} no controla ni se responsabiliza del contenido, funcionamiento o tratamientos de datos realizados por esos terceros fuera de este sitio web.`,
          ],
        },
        {
          title: "Responsabilidad técnica",
          paragraphs: [
            "La web se publica como sitio estático y puede quedar temporalmente inaccesible por operaciones de mantenimiento, incidencias del proveedor de alojamiento, problemas de red o causas ajenas al titular.",
            "El titular no garantiza la ausencia absoluta de errores, aunque mantiene una arquitectura orientada a minimizar dependencias externas innecesarias en la web pública.",
          ],
        },
        {
          title: "Legislación aplicable",
          paragraphs: [
            "Este aviso se rige por la legislación española. Para cualquier cuestión relacionada con el sitio web se atenderá al marco legal aplicable en materia de servicios de la sociedad de la información, consumidores, propiedad intelectual y protección de datos.",
          ],
        },
        {
          title: "Contacto legal",
          paragraphs: [`Para consultas sobre este aviso o posibles incidencias relativas al contenido del sitio, puede contactarse en: ${contact}.`],
        },
      ],
    },
    "politica-privacidad": {
      slug: "politica-privacidad",
      title: "Política de Privacidad",
      description: `Información sobre el tratamiento de datos personales en la web de ${brand}.`,
      updatedAt: currentDate,
      sections: [
        {
          title: "Responsable del tratamiento",
          list: [
            `Responsable: ${owner}`,
            `Nombre comercial: ${brand}`,
            `NIF: ${legalData.nif}`,
            `Domicilio: ${legalData.address}`,
            `Email: ${legalData.email}`,
            `Teléfono: ${legalData.phone}`,
          ],
        },
        {
          title: "Funcionamiento real de la web",
          paragraphs: [
            "La web no incluye formularios de contacto, newsletter, área de usuario, comentarios, descargas con registro, analítica web, reCAPTCHA ni sistemas de publicidad comportamental.",
            "Las vías de contacto disponibles son enlaces de teléfono, email, WhatsApp e Instagram. Si la persona usuaria contacta por esas vías, el tratamiento se realiza a partir de la comunicación iniciada voluntariamente por ella y, en su caso, también conforme a las condiciones del servicio externo utilizado.",
          ],
        },
        {
          title: "Datos tratados",
          list: [
            "Datos identificativos y de contacto que la persona facilite al escribir por email, WhatsApp, Instagram, teléfono u otro canal enlazado desde la web.",
            "Información incluida libremente en la consulta o solicitud profesional.",
            "Datos técnicos mínimos derivados de la conexión al sitio, como dirección IP, fecha, hora, recurso solicitado, agente de usuario y registros necesarios para servir la web y mantener su seguridad.",
          ],
        },
        {
          title: "Finalidades",
          list: [
            "Responder consultas y solicitudes recibidas por los canales de contacto disponibles.",
            "Mantener comunicaciones relacionadas con una petición, presupuesto, servicio o relación profesional iniciada por la persona interesada.",
            "Garantizar la disponibilidad, seguridad y funcionamiento técnico de la web.",
            "Cumplir obligaciones legales aplicables.",
          ],
        },
        {
          title: "Base jurídica",
          list: [
            "Consentimiento o solicitud de la persona interesada al contactar voluntariamente.",
            "Aplicación de medidas precontractuales o ejecución de una relación profesional cuando la comunicación tenga por objeto solicitar o gestionar un servicio.",
            "Interés legítimo en mantener la seguridad, disponibilidad y correcto funcionamiento de la web.",
            "Cumplimiento de obligaciones legales cuando corresponda.",
          ],
        },
        {
          title: "Conservación",
          paragraphs: [
            "Los datos se conservarán durante el tiempo necesario para atender la consulta, gestionar la relación profesional o cumplir las obligaciones legales aplicables. Cuando dejen de ser necesarios, se suprimirán o bloquearán conforme a la normativa vigente.",
          ],
        },
        {
          title: "Destinatarios y proveedores",
          paragraphs: [
            "No se comunican datos personales a terceros con fines comerciales, analíticos o publicitarios desde la web pública.",
            "Pueden intervenir proveedores técnicos necesarios para la prestación del servicio: Vercel como plataforma de alojamiento de la web pública y Sanity como sistema de gestión de contenido usado en el proceso de construcción o mantenimiento editorial. La web pública no carga el Studio de Sanity ni sus scripts al usuario final.",
            "Los canales externos enlazados, como WhatsApp, Instagram, TikTok, Facebook o el cliente de email/teléfono que use la persona, son servicios de terceros con políticas propias cuando se accede a ellos.",
          ],
        },
        {
          title: "Derechos",
          paragraphs: [
            `Las personas interesadas pueden solicitar el acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de sus datos, cuando proceda, escribiendo a ${legalData.email}.`,
            "También pueden presentar una reclamación ante la Agencia Española de Protección de Datos si consideran que el tratamiento no se ajusta a la normativa.",
          ],
        },
        {
          title: "Menores",
          paragraphs: [
            "La web no está dirigida específicamente a menores ni ofrece servicios de registro o contratación online. Si una persona menor de edad contacta a través de un canal externo, deberá contar con la autorización necesaria de sus representantes legales cuando proceda.",
          ],
        },
      ],
    },
    "politica-cookies": {
      slug: "politica-cookies",
      title: "Política de Cookies",
      description: `Información sobre cookies y almacenamiento local en la web de ${brand}.`,
      updatedAt: currentDate,
      sections: [
        {
          title: "Resumen",
          paragraphs: [
            "La auditoría técnica del proyecto no ha detectado cookies propias, cookies analíticas, cookies publicitarias, cookies de terceros, localStorage, sessionStorage ni IndexedDB en la web pública.",
            "Por tanto, no se implementa un banner de consentimiento porque no hay cookies no técnicas ni tecnologías equivalentes que requieran consentimiento previo en el funcionamiento actual.",
          ],
        },
        {
          title: "Cookies utilizadas",
          list: [
            "Cookies propias: no detectadas en el código de la web pública.",
            "Cookies analíticas: no detectadas. No hay Google Analytics ni herramientas equivalentes.",
            "Cookies publicitarias o de seguimiento: no detectadas.",
            "Cookies de terceros por embeds: no detectadas. La web no inserta iframes de YouTube, Vimeo, Instagram, Google Maps ni servicios similares.",
            "Almacenamiento local del navegador: no detectado.",
          ],
        },
        {
          title: "Servicios externos enlazados",
          paragraphs: [
            "La web contiene enlaces a plataformas externas como WhatsApp, Instagram, TikTok y Facebook. Estos enlaces no instalan cookies desde esta web por sí mismos, pero al abrirlos la persona usuaria navega a servicios de terceros que pueden usar sus propias cookies y tecnologías de seguimiento.",
          ],
        },
        {
          title: "Proveedor de alojamiento",
          paragraphs: [
            "La web se aloja en Vercel. El proveedor de alojamiento puede tratar datos técnicos de conexión necesarios para entregar la página, seguridad, prevención de abuso y diagnóstico de incidencias. Este tratamiento no deriva de cookies creadas por el código de la web pública.",
          ],
        },
        {
          title: "Cambios futuros",
          paragraphs: [
            "Si en el futuro se incorporan analítica, publicidad, mapas embebidos, vídeos embebidos, widgets sociales, formularios con protección antiabuso u otros servicios que usen cookies o tecnologías equivalentes, esta política deberá actualizarse antes de su publicación y, cuando proceda, deberá bloquearse su carga hasta obtener consentimiento válido.",
          ],
        },
        {
          title: "Cómo gestionar cookies en el navegador",
          paragraphs: [
            "Aunque esta web no crea cookies en su funcionamiento actual, cualquier persona puede revisar, bloquear o borrar cookies desde la configuración de su navegador. Esta gestión se realiza en el navegador utilizado para navegar por Internet.",
          ],
        },
        {
          title: "Contacto",
          paragraphs: [`Para dudas sobre esta política puede contactarse con ${brand} en ${contact}.`],
        },
      ],
    },
  };
}
