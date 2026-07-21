import { QueryTypes } from "sequelize";
import { SequelizeDatabase } from "../../infraestructure/database/sequelize";

const JOB_ROLES = [
  { key: "enc_tienda", name: "Encargado de Tienda en Turno", code: "ENC-TIENDA" },
  { key: "enc_tablajeros", name: "Encargado de Tablajeros en Turno", code: "ENC-TABLAJ" },
  { key: "tablajero", name: "Tablajero", code: "TABLAJERO" },
  { key: "ayudante_tablajero", name: "Ayudante de Tablajero", code: "AYU-TABLA" },
  { key: "despachador", name: "Despachador / Ayudante General", code: "DESPACHA" },
  { key: "chicharronero", name: "Chicharronero", code: "CHICHARRON" },
  { key: "parrillero", name: "Parrillero", code: "PARRILLERO" },
  { key: "intendente", name: "Intendente de Limpieza", code: "INTEND-LIMP" },
  { key: "carnes_frias", name: "Carnes Frías", code: "CARNES-FR" },
  { key: "verduras", name: "Verdura, Abarrotes y Agranel", code: "VERDURAS" },
  { key: "recibo", name: "Encargado de Recibo / Almacén", code: "RECIBO" },
  { key: "cajero", name: "Cajero(a)", code: "CAJERO" },
];

const ACTIVITIES_BY_ROLE: Record<string, any[]> = {
  enc_tienda: [
    { name: "Revisión de puntos fríos", description: "Hacer un rondín a todos los puntos fríos verificando funcionamiento y temperatura. Reportar fallas a administración.", default_deadline: "07:30" },
    { name: "Verificar sistema punto de venta", description: "Encender y verificar que el sistema de punto de venta e internet estén funcionando correctamente.", default_deadline: "07:30" },
    { name: "Organización área de cajas", description: "Asegurar que cajeros cuenten con morralla, fondo de caja, bolsas o rollo suficiente. Aperturar dos cajas.", default_deadline: "08:00" },
    { name: "Recorrido piso de venta (apertura)", description: "Recorrido vitrina por vitrina detectando limpieza, rotación, acomodo, caducidades, mal empacado, mal etiquetado, productos sin precio.", default_deadline: "08:00" },
    { name: "Identificación y proceso de producto dañado", description: "Identificar productos dañados durante el recorrido y asignarlos al departamento correspondiente para su valoración.", default_deadline: "08:00" },
    { name: "Acomodo y frenteo de producto (PEPS)", description: "Acomodar y frentear producto, identificar faltantes y abastecer aplicando método PEPS (primeras entradas primeras salidas).", default_deadline: "09:00" },
    { name: "Recepción de producto y entrega de facturas", description: "Supervisar la recepción de mercancía y gestionar la entrega de facturas a administración.", default_deadline: "14:00" },
    { name: "Supervisar rendimiento del personal", description: "Supervisar y vigilar el rendimiento del personal durante el turno.", default_deadline: "16:00" },
    { name: "Control de facturas, remisiones y cortes de caja", description: "Gestionar facturas, remisiones, cortes de caja, cancelaciones, cobros, entrega de valores y devoluciones en sistema.", default_deadline: "20:00" },
    { name: "Asegurar calidad y servicio al cliente", description: "Garantizar el cumplimiento de calidad, existencias adecuadas y nivel de servicio al cliente durante todo el turno.", default_deadline: "20:00" },
  ],
  enc_tablajeros: [
    { name: "Apertura: asignación de roles y revisión de producto", description: "Asignar rol de trabajo a cada persona. Revisar empaque (fechas, etiquetas, charolas, vitafil, presentación). Revisar limpieza y temperaturas. Re-empaquetar charolas en mal estado y retirar caducados.", default_deadline: "08:00" },
    { name: "Seguir hoja de proceso diaria", description: "Llevar a cabo el día de trabajo en base a la hoja de proceso diaria para procesar y exhibir mercancía según flujo de venta.", default_deadline: "10:00" },
    { name: "Supervisar llenado de vitrinas y rotación", description: "Supervisar y dar seguimiento al llenado de vitrinas (isla, granel, empanizados y cortes) y dar rotación al producto.", default_deadline: "12:00" },
    { name: "Limpieza del área en tiempos muertos", description: "Enfatizar con el equipo la limpieza del área al terminar de empacar cada producto y aprovechar tiempos muertos.", default_deadline: "16:00" },
    { name: "Atención al cliente y venta cruzada", description: "Instruir al equipo en cordialidad, atención al cliente y venta de otros productos para que el cliente no se vaya sin lo que necesita.", default_deadline: "16:00" },
    { name: "Control de existencias en cuarto frío", description: "Revisar producto en cuarto frío, determinar si es necesario resurtir, mantener rotación, limpieza y orden. Etiquetas al frente.", default_deadline: "14:00" },
    { name: "Cuidar presentación personal del equipo", description: "Verificar que el equipo cumpla con imagen impecable: baño diario, uniforme completo y limpio, guantes, cofia, tapabocas, uñas cortas.", default_deadline: "07:30" },
    { name: "Cierre: limpieza de área y herramientas", description: "Revisar cuarto frío y vitrinas al cierre. Limpiar área y herramientas. Evitar lavar sierra con chorros, no mojar básculas/molinos/rebanadoras. Dejar mostradores limpios.", default_deadline: "20:00" },
  ],
  tablajero: [
    { name: "Atención al cliente", description: "Saludo cordial, el cliente es primero. Mostrar interés a sus necesidades. Revisar que etiqueta del precio concuerde con el producto entregado.", default_deadline: "08:00" },
    { name: "Proceso de cortes", description: "Rendimiento de la pieza de principio a fin. Regular grasa (un dedo). Entreverar las calidades de producto al acomodar.", default_deadline: "12:00" },
    { name: "Presentación de cortes", description: "Emplaye correcto, acomodo adecuado en charola, acomodo adecuado en vitrina, buena imagen del producto.", default_deadline: "12:00" },
    { name: "Rotación del producto", description: "Buena exhibición, reempaque, revisar caducidades. Entreverar producto nuevo con anterior. Charolas nuevas abajo, días previos arriba.", default_deadline: "14:00" },
    { name: "Vitrinas limpias", description: "Mantener limpieza de vidrios y charolas durante todo el turno.", default_deadline: "16:00" },
    { name: "Control cuarto frío (PEPS)", description: "Llevar control PEPS: primeras entradas primeras salidas. Carne siempre empaquetada. Delimitar áreas. Mantener puertas cerradas.", default_deadline: "14:00" },
    { name: "Cierre: revisión de temperatura y limpieza", description: "Revisar temperatura de todas las vitrinas. Limpiar área y herramientas (no lavar sierra con chorros, no mojar básculas). Dejar mostradores limpios.", default_deadline: "20:00" },
    { name: "Higiene personal", description: "Presentación impecable: cabello corto, barba alineada, uñas cortas y limpias. Prohibido anillos, aretes, piercing, cadenas.", default_deadline: "07:30" },
    { name: "Uniforme completo y limpio", description: "Portar en todo momento el uniforme: bata, pantalón, mandil, botas, guantes, cofia y cubrebocas limpio.", default_deadline: "07:30" },
  ],
  ayudante_tablajero: [
    { name: "Atención al cliente", description: "Saludo cordial, el cliente es primero. Revisar que etiqueta del precio concuerde con el producto.", default_deadline: "08:00" },
    { name: "Ofrecer productos y promociones", description: "Ofrecer productos nuevos y dar a conocer las promociones u ofertas del día.", default_deadline: "12:00" },
    { name: "Proceso de cortes", description: "Rendimiento de la pieza de principio a fin. Entreverar las calidades de producto al acomodar.", default_deadline: "12:00" },
    { name: "Presentación de cortes", description: "Emplaye correcto, acomodo adecuado en charola y vitrina, buena imagen del producto.", default_deadline: "12:00" },
    { name: "Rotación del producto", description: "Buena exhibición, reempaque, caducidades. Producto nuevo abajo, días previos arriba.", default_deadline: "14:00" },
    { name: "Vitrinas limpias", description: "Mantener limpieza de vidrios y charolas durante el turno.", default_deadline: "16:00" },
    { name: "Cierre: limpieza de área y herramientas", description: "Revisar temperatura de vitrinas. Limpiar área y herramientas. Dejar mostradores limpios.", default_deadline: "20:00" },
    { name: "Higiene personal", description: "Presentación impecable: cabello corto, barba alineada, uñas cortas y limpias. Sin accesorios.", default_deadline: "07:30" },
    { name: "Uniforme completo y limpio", description: "Portar en todo momento: bata, pantalón, mandil, botas, guantes, cofia y cubrebocas limpio.", default_deadline: "07:30" },
  ],
  despachador: [
    { name: "Atención al cliente", description: "Saludo cordial, el cliente es primero. Revisar que etiqueta del precio concuerde con el producto.", default_deadline: "08:00" },
    { name: "Ofrecer productos y promociones", description: "Ofrecer productos nuevos y dar a conocer las promociones u ofertas del día.", default_deadline: "12:00" },
    { name: "Presentación de cortes", description: "Emplaye correcto, acomodo adecuado en charola y vitrina, buena imagen del producto.", default_deadline: "12:00" },
    { name: "Rotación del producto", description: "Buena exhibición, reempaque, caducidades. Producto nuevo abajo, días previos arriba.", default_deadline: "14:00" },
    { name: "Vitrinas limpias", description: "Mantener limpieza de vidrios y charolas durante el turno.", default_deadline: "16:00" },
    { name: "Limpieza de áreas y herramientas", description: "Limpieza de paredes, piso, pasillos, sierras, cuchillos, molinos, rebanadoras, básculas, cajas plásticas. Basura en su lugar en todo momento.", default_deadline: "20:00" },
    { name: "Higiene personal", description: "Presentación impecable: cabello corto, barba alineada, uñas cortas. Sin accesorios. No entrar al cuarto frío sin autorización.", default_deadline: "07:30" },
    { name: "Uniforme completo y limpio", description: "Portar en todo momento: bata, pantalón, mandil, botas, guantes, cofia y cubrebocas limpio.", default_deadline: "07:30" },
  ],
  chicharronero: [
    { name: "Seguir hoja de proceso diaria", description: "Llevar a cabo el día de trabajo en base a la hoja de proceso diaria para procesar y exhibir mercancía.", default_deadline: "10:00" },
    { name: "Elaboración de productos para el mediodía", description: "Revisar sobrante del día anterior. Elaborar desde apertura: chicharrón de cachete, molleja de res, pierna de pollo frita, papas fritas, jalapeños fritos, salsas, totopos y manteca. Listos al mediodía.", default_deadline: "12:00" },
    { name: "Atención al cliente y venta cruzada", description: "Cordialidad, atención a solicitudes y venta de otros productos para que el cliente no se vaya sin lo que necesita.", default_deadline: "16:00" },
    { name: "Limpieza del área en tiempos muertos", description: "Mantener limpia el área durante el día aprovechando tiempos entre actividades.", default_deadline: "16:00" },
    { name: "Cuidar presentación personal", description: "Presentación impecable: baño diario, uniforme completo y limpio, guantes, cofia, tapabocas, uñas cortas.", default_deadline: "07:30" },
    { name: "Control de existencias en cuarto frío", description: "Revisar producto en cuarto frío, resurtir si es necesario. Rotación, limpieza y orden. Etiquetas al frente.", default_deadline: "14:00" },
    { name: "Cierre: vaciar vitrina y limpiar área", description: "Vaciar vitrina caliente, enfriar producto y guardar en cuarto frío. Revisar existencias y temperatura. Limpiar área y herramientas. Dejar vitrina y mostrador limpios.", default_deadline: "20:00" },
  ],
  parrillero: [
    { name: "Preparación e inicio de parrilla", description: "Preparar la parrilla y los insumos necesarios para iniciar operaciones al abrir la tienda.", default_deadline: "08:00" },
    { name: "Despacho de producto asado", description: "Asar y despachar el producto solicitado por el cliente, validando con ticket de compra.", default_deadline: "16:00" },
    { name: "Limpieza de área y herramientas", description: "Mantener limpia el área de la parrilla durante el turno y al cierre.", default_deadline: "20:00" },
  ],
  intendente: [
    { name: "Limpieza general de áreas asignadas", description: "Mantener limpia el área de trabajo asignada por el supervisor durante todo el turno.", default_deadline: "20:00" },
    { name: "Preparación de alimentos para el personal", description: "Cocinar y proporcionar los alimentos al personal que labore en la empresa.", default_deadline: "14:00" },
    { name: "Limpieza de baños y comedor", description: "Limpieza de baños, comedor, tarja, mesas y lockers del personal.", default_deadline: "12:00" },
  ],
  carnes_frias: [
    { name: "Apertura: revisión de producto", description: "Revisar empaque (fechas, etiquetas borrosas, charolas maltratadas, vitafil, presentación). Revisar limpieza y temperaturas.", default_deadline: "08:00" },
    { name: "Seguir hoja de proceso diaria", description: "Llevar a cabo el día de trabajo en base a la hoja de proceso diaria para procesar y exhibir mercancía.", default_deadline: "10:00" },
    { name: "Re-empaquetar y retirar caducados", description: "Re-empaquetar charolas retiradas en mal estado o dañadas. Retirar producto caducado de vitrinas.", default_deadline: "09:00" },
    { name: "Supervisar llenado de vitrina y rotación", description: "Dar seguimiento al llenado de vitrina y exhibición. Dar rotación al producto. Mantener limpias vitrina, rebanadoras y mesa de trabajo.", default_deadline: "12:00" },
    { name: "Atención al cliente y venta cruzada", description: "Cordialidad, atención a solicitudes y venta de otros productos.", default_deadline: "16:00" },
    { name: "Limpieza del área en tiempos muertos", description: "Mantener limpia el área al terminar de empacar y en tiempos muertos.", default_deadline: "16:00" },
    { name: "Cuidar presentación personal", description: "Presentación impecable: baño diario, uniforme completo, guantes, cofia, tapabocas, uñas cortas, cabello recogido.", default_deadline: "07:30" },
    { name: "Control de existencias en cuarto frío", description: "Revisar producto en cuarto frío, resurtir si necesario. Rotación, limpieza y orden. Etiquetas al frente.", default_deadline: "14:00" },
    { name: "Cierre: limpieza y revisión", description: "Revisar cuarto frío y vitrinas al cierre. Limpiar área y herramientas (no lavar rebanadora con chorros, no mojar básculas). Mostradores limpios.", default_deadline: "20:00" },
    { name: "Manejo de sobrantes y productos manchados", description: "Canalizar sobrantes y productos manchados al área de carnicería para re-proceso (moler/cubos). No tirar mercancía sin autorización.", default_deadline: "18:00" },
  ],
  verduras: [
    { name: "Apertura: revisión de producto y área", description: "Revisar empaque (fechas, etiquetas, charolas, vitafil, presentación). Revisar limpieza y temperaturas en las áreas de exhibición.", default_deadline: "08:00" },
    { name: "Seguir hoja de proceso diaria", description: "Llevar a cabo el día de trabajo en base a la hoja de proceso diaria para exhibir mercancía según flujo de venta.", default_deadline: "10:00" },
    { name: "Limpieza del área en tiempos muertos", description: "Mantener limpia el área al terminar de empacar cada producto y mantener limpia la vitrina en tiempos muertos.", default_deadline: "16:00" },
    { name: "Supervisar llenado de vitrina y rotación", description: "Dar seguimiento al llenado de vitrina y exhibidor. Dar rotación al producto. Mantener limpias estas áreas.", default_deadline: "12:00" },
    { name: "Atención al cliente y venta cruzada", description: "Cordialidad, atención a solicitudes y venta de otros productos.", default_deadline: "16:00" },
    { name: "Cuidar presentación personal", description: "Presentación impecable: baño diario, uniforme completo, guantes, cofia, tapabocas, uñas cortas, cabello recogido.", default_deadline: "07:30" },
    { name: "Control de existencias en cuarto frío", description: "Revisar producto en cuarto frío, resurtir si necesario. Rotación, limpieza y orden.", default_deadline: "14:00" },
    { name: "Cierre: revisión y limpieza", description: "Revisar cuarto frío y temperatura. Revisar vitrina y dejar área bien limpia y bien abastecida.", default_deadline: "20:00" },
  ],
  recibo: [
    { name: "Recibir mercancía solo por acceso posterior", description: "Toda mercancía sin excepción se recibe por la puerta trasera. Nunca fuera del local.", default_deadline: "14:00" },
    { name: "Verificar sellos de seguridad del camión", description: "Revisar sellos de seguridad y verificar numeración contra la factura del proveedor.", default_deadline: "14:00" },
    { name: "Calibrar y verificar báscula de recibo", description: "Verificar que la báscula esté en ceros y correctamente calibrada antes de recibir.", default_deadline: "08:00" },
    { name: "Inspección física de mercancía", description: "Revisar cajas individualmente. Verificar que el contenido coincida con etiqueta. Revisar buen estado, empaque, aspecto y caducidad (mínimo 1 mes en carnes).", default_deadline: "14:00" },
    { name: "Refrigeración inmediata y acomodo en cuarto frío", description: "Refrigerar mercancía en el momento de recibirla. Acomodar ordenadamente con rotación PEPS.", default_deadline: "14:00" },
    { name: "Firmar y enviar facturas", description: "Firmar facturas con sello y fecha. Enviar imagen vía WhatsApp al grupo correspondiente. Archivar para envío a oficinas.", default_deadline: "16:00" },
    { name: "Gestionar devoluciones y faltantes", description: "Notificar faltantes o producto en mal estado al encargado de compras con foto y video. Llenar formato de devolución y gráparlo a la factura.", default_deadline: "14:00" },
    { name: "Revisión de existencias por departamento", description: "Verificar existencias y productos por caducar de cada departamento. Enviar información al grupo de WhatsApp de Existencias.", default_deadline: "17:00" },
    { name: "Registro de mermas (chicharrón/barbacoa)", description: "Pesar producto antes y después de procesar. Registrar en formato de procesos de comida. Dar salida a crudos e insumos y entrada a producto terminado.", default_deadline: "18:00" },
  ],
  cajero: [
    { name: "Preparación apertura de caja", description: "Revisar fondo de caja, rollo de impresora y terminal de pago con tarjeta. Área de trabajo limpia. Apertura en sistema (Microsip).", default_deadline: "08:00" },
    { name: "Atención al cliente", description: "Cordialidad: ¡Buen día! ¡Buenas tardes! ¿Encontró lo que buscaba? ¡Gracias por su compra!", default_deadline: "08:00" },
    { name: "Limpieza del área y acomodo de mercancía", description: "Mantener limpia el área y apoyar en acomodo de mercancía de piso en tiempos muertos.", default_deadline: "16:00" },
    { name: "Verificar etiqueta y peso del producto", description: "Revisar que etiqueta coincida con el producto. No cobrar si etiqueta no está pegada. Verificar que peso corresponda.", default_deadline: "08:00" },
    { name: "Revisar que todos los productos estén cobrados", description: "Contabilizar artículos del cliente vs. lo cobrado antes de totalizar. Revisar artículos que queden debajo del carrito.", default_deadline: "08:00" },
    { name: "Realizar retiros a tiempo", description: "Realizar retiros en tiempo y forma. Máximo $4,000 en caja. Revisar billetes (billete falso = responsabilidad del cajero).", default_deadline: "16:00" },
    { name: "Doble conteo de retiros frente a cámara", description: "Al entregar retiro al encargado, hacer doble conteo: primero el cajero, luego el encargado. Siempre frente a cámara.", default_deadline: "16:00" },
    { name: "Cuidar presentación personal", description: "Presentación impecable: baño diario, uniforme limpio, uñas limpias, cabello recogido.", default_deadline: "07:30" },
    { name: "Cuidar herramientas de trabajo", description: "Evitar el mal uso de las herramientas de trabajo de la caja.", default_deadline: "08:00" },
    { name: "Cierre de caja con el encargado", description: "Realizar corte de caja en compañía del encargado en turno. Dejar área limpia. (Proceso de cierre en sistema Microsip).", default_deadline: "20:30" },
    { name: "No prestar la caja", description: "Nunca prestar la caja a otra persona. Cualquier faltante se divide entre quienes estuvieron en ella.", default_deadline: "08:00" },
  ],
};

export class TemplateInjectorService {
  static async injectAllStores() {
    try {
      const sequelize = SequelizeDatabase.getSequelizeInstance();
      const stores = await sequelize.query<{ id: number }>(
        "SELECT id FROM stores WHERE deleted_at IS NULL",
        { type: QueryTypes.SELECT }
      );

      for (const store of stores) {
        await this.injectForStore(store.id);
      }
      
      console.log(`TemplateInjectorService: ✅ Job Roles and Activities templates verified/injected for ${stores.length} stores.`);
    } catch (error) {
      console.error("TemplateInjectorService: ❌ Error running global injection", error);
    }
  }

  static async injectForStore(storeId: number) {
    try {
      const sequelize = SequelizeDatabase.getSequelizeInstance();
      
      // Verify if roles already exist for this store
      const existingRoles = await sequelize.query<{ id: number }>(
        `SELECT id FROM job_roles WHERE store_id = ${storeId} AND deleted_at IS NULL LIMIT 1`,
        { type: QueryTypes.SELECT }
      );

      if (existingRoles.length > 0) {
        return; // Templates already injected
      }

      const now = new Date();

      // Get or create General area
      let areas = await sequelize.query<{ id: number }>(
        `SELECT id FROM areas WHERE store_id = ${storeId} AND deleted_at IS NULL ORDER BY id ASC LIMIT 1`,
        { type: QueryTypes.SELECT }
      );

      if (areas.length === 0) {
        await sequelize.query(
          `INSERT INTO areas (name, code, store_id, created_at, updated_at) VALUES ('General', 'GENERAL', ${storeId}, NOW(), NOW())`
        );
        areas = await sequelize.query<{ id: number }>(
          `SELECT id FROM areas WHERE store_id = ${storeId} AND code = 'GENERAL' ORDER BY id DESC LIMIT 1`,
          { type: QueryTypes.SELECT }
        );
      }

      const areaId = areas[0].id;

      for (const role of JOB_ROLES) {
        // Insert Role
        const roleInsert = await sequelize.query<{ id: number }>(
          `INSERT INTO job_roles (name, code, store_id, created_at, updated_at) 
           VALUES (:name, :code, :storeId, NOW(), NOW()) RETURNING id`,
          { 
            replacements: { name: role.name, code: role.code, storeId },
            type: QueryTypes.SELECT
          }
        );

        // Explicitly handle RETURNING array from PostgreSQL
        const jobRoleId = roleInsert[0].id;

        const activities = ACTIVITIES_BY_ROLE[role.key] || [];

        if (activities.length > 0) {
          const activityValues = activities.map(act => 
            `('${act.name}', '${act.description}', '${act.default_deadline}', ${areaId}, ${jobRoleId}, NOW(), NOW())`
          ).join(", ");
          
          await sequelize.query(
            `INSERT INTO activities (name, description, default_deadline, area_id, job_role_id, created_at, updated_at) 
             VALUES ${activityValues}`
          );
        }
      }
    } catch (error) {
      console.error(`TemplateInjectorService: ❌ Error injecting templates for store ${storeId}`, error);
    }
  }
}
