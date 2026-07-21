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
            "El titular adopta medidas razonables para procurar el correcto funcionamiento del sitio web. No obstante, el acceso puede verse interrumpido por tareas de mantenimiento, incidencias técnicas, problemas de red, actuaciones del proveedor de alojamiento o causas ajenas a su control.",
            "El titular no garantiza la disponibilidad continua del sitio ni la inexistencia absoluta de errores, pero actuará con diligencia para corregir las incidencias que puedan afectar a su funcionamiento cuando tenga conocimiento de ellas.",
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
            `Domicilio: ${legalData.address}`,
            `Email: ${legalData.email}`,
            `Teléfono: ${legalData.phone}`,
          ],
        },
        {
          title: "Medios de contacto y origen de los datos",
          paragraphs: [
            "El sitio web tiene carácter informativo y facilita distintos canales para contactar con el responsable, principalmente teléfono, correo electrónico, WhatsApp e Instagram. No se recaban datos personales mediante formularios propios del sitio web.",
            "Cuando una persona contacta a través de cualquiera de los medios indicados, los datos facilitados voluntariamente se tratarán para atender la consulta, solicitud o comunicación remitida.",
          ],
        },
        {
          title: "Datos tratados",
          list: [
            "Datos identificativos y de contacto que la persona facilite al escribir por email, WhatsApp, Instagram, teléfono u otro canal enlazado desde la web.",
            "Información incluida libremente en la consulta o solicitud profesional.",
            "Datos técnicos asociados al acceso y uso del sitio que puedan ser tratados por el proveedor de alojamiento para entregar la página, mantener la seguridad del servicio y diagnosticar incidencias.",
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
            "No están previstas comunicaciones de datos personales a terceros con fines comerciales, analíticos o publicitarios desde este sitio web.",
            "Podrán acceder a determinados datos los proveedores técnicos necesarios para la prestación del servicio, en particular el proveedor de alojamiento de la web y el sistema de gestión de contenidos empleado para su mantenimiento editorial, en la medida estrictamente necesaria para sus respectivas funciones.",
            "Cuando la persona usuaria acceda a canales externos enlazados desde la web, como WhatsApp, Instagram, TikTok, Facebook o su propio cliente de correo o teléfono, el tratamiento realizado por dichos servicios se regirá por sus respectivas condiciones y políticas de privacidad.",
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
            "El sitio web no está dirigido específicamente a menores de edad. Si una persona menor contacta a través de un canal externo, deberá contar con la autorización necesaria de sus representantes legales cuando proceda.",
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
          title: "Uso de cookies",
          paragraphs: [
            "En la fecha de la última revisión de esta política, este sitio web no instala cookies propias, cookies analíticas, cookies publicitarias ni cookies de terceros durante la navegación por sus páginas.",
            "Tampoco utiliza tecnologías equivalentes de almacenamiento en el navegador para realizar medición, seguimiento, publicidad comportamental o elaboración de perfiles.",
            "Por este motivo, no se muestra un panel o banner de consentimiento de cookies, al no existir cookies no exceptuadas que deban ser aceptadas o rechazadas antes de su instalación.",
          ],
        },
        {
          title: "Cookies y tecnologías equivalentes",
          list: [
            "Cookies técnicas propias: no se instalan desde el código del sitio web.",
            "Cookies analíticas: no se utilizan.",
            "Cookies publicitarias o de seguimiento: no se utilizan.",
            "Cookies de terceros derivadas de contenido embebido: no se utilizan, ya que el sitio no incorpora reproductores, mapas, iframes o widgets sociales embebidos.",
            "Almacenamiento local del navegador: no se utiliza con fines de identificación, medición, seguimiento o personalización.",
          ],
        },
        {
          title: "Servicios externos enlazados",
          paragraphs: [
            "El sitio web puede contener enlaces a plataformas externas como WhatsApp, Instagram, TikTok o Facebook. Estos enlaces no instalan cookies desde este sitio por sí mismos.",
            "Si la persona usuaria decide abrir dichos enlaces, accederá a sitios o aplicaciones gestionados por terceros, que podrán utilizar sus propias cookies y tecnologías similares conforme a sus respectivas políticas.",
          ],
        },
        {
          title: "Proveedor de alojamiento",
          paragraphs: [
            "El proveedor de alojamiento del sitio puede tratar datos técnicos de conexión necesarios para entregar las páginas, preservar la seguridad del servicio, prevenir abusos y diagnosticar incidencias. Dicho tratamiento técnico no implica la instalación de cookies propias desde el código de este sitio web.",
          ],
        },
        {
          title: "Cambios futuros",
          paragraphs: [
            "Si en el futuro se incorporan herramientas de analítica, publicidad, mapas embebidos, vídeos embebidos, widgets sociales, formularios con protección antiabuso u otros servicios que utilicen cookies o tecnologías equivalentes, esta política será actualizada.",
            "Cuando dichas cookies requieran consentimiento previo, no deberán instalarse hasta que la persona usuaria haya prestado un consentimiento válido conforme a la normativa aplicable.",
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
