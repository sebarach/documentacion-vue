# Negocio SQL
---

- Creacion de Encuestas Profesores

``` sql
select * FROM [dbo].[Omega_EncuestaOmegaVersion] -- Crear version 2021 Asociado a encuestaid=3
insert into [Omega_EncuestaOmegaVersion] values (3,1,0,GETDATE(),GETDATE(),GETDATE()+24,9,'Encuesta de Transferencia de Investigación a la Docencia 2021')
insert into [Omega_EncuestaOmegaVersion] values (1,1,0,GETDATE(),GETDATE(),GETDATE()+24,9,'Encuesta Área Investigación 2021')
select * FROM [dbo].[Omega_EncuestaOmegaPoblacion] -- Se debe crear una nueva población y asociaro a la tabla Omega_EncuestaOmegaVersion
insert into [Omega_EncuestaOmegaPoblacion] values ('Encuesta de Transferencia de Investigación a la Docencia 2021',GETDATE(),1,0)
insert into [Omega_EncuestaOmegaPoblacion] values ('Encuesta Área Investigación 2021',GETDATE(),1,0)
select * FROM [dbo].[Omega_EncuestaOmegaPoblacionUsuarios] order by 1 desc-- where UsuarioId = 2449 --  mario.vergara@uai.cl
insert into [Omega_EncuestaOmegaPoblacionUsuarios] values (9,2449,0) --  mario.vergara@uai.cl
```

- Cantidad de inscripciones por Expediente
```sql
select CP.NOMBRE NOMBRE,CP.ApellidoPaterno,CP.RUT RUT,CP.DigitoVerificador DV, ink.ExpedienteId,
COUNT(INK.ExpedienteId) TOTAL_INSCRIPCIONES, -- todas las inscripciones del período
sum(case when isnull(EI.EtapaInscripcionAsignaturaId,0) = 351 then 1 else 0 end) INSCRIPCIONES_PROCESO, -- las inscripciones hechas por sistema de toma de ramos
 grup.Numero NumeroGrupo,grup.EtapaInscripcionAsignaturaId Etapa, convert(varchar(16),grup.FechaInicio,120) HoraGrupo
from Expediente_Expediente EE 
JOIN Expediente_Alumno EA ON EE.AlumnoId = EA.Id
JOIN Common_Persona CP ON EA.PersonaId = CP.Id
JOIN InscripcionAsignatura_ExpedienteGrupoLnk INK ON EE.Id = INK.ExpedienteId and INK.IsDeleted = 0
join InscripcionAsignatura_GrupoInscripcionAsignatura grup on ink.GrupoInscripcionId = grup.Id and grup.IsDeleted = 0 and grup.EtapaInscripcionAsignaturaId = 351 
left join Expediente_Inscripcion EI on EI.ExpedienteId = EE.id AND EI.IsAnulada = 0 AND EI.IsDeleted = 0  --and EI.EtapaInscripcionAsignaturaId = 351 
left join Planificacion_Seccion SS on SS.id = EI.SeccionId and SS.IsDeleted = 0 and SS.PeriodoAcademicoId = 3169
GROUP BY INK.Id,ink.ExpedienteId,grup.Numero,grup.EtapaInscripcionAsignaturaId,CP.NOMBRE,CP.RUT,CP.DigitoVerificador,CP.ApellidoPaterno, grup.FechaInicio
order by grup.Numero
```

- Total Por Grupo
```sql
select grup.Numero, count(distinct EE.id) Q_Expedientes,   
COUNT(INK.ExpedienteId) TOTAL_INSCRIPCIONES, -- todas las inscripciones del período
sum(case when isnull(EI.EtapaInscripcionAsignaturaId,0) = 351 then 1 else 0 end) INSCRIPCIONES_PROCESO -- las inscripciones hechas por sistema de toma de ramos
from Expediente_Expediente EE 
JOIN Expediente_Alumno EA ON EE.AlumnoId = EA.Id
JOIN Common_Persona CP ON EA.PersonaId = CP.Id
JOIN InscripcionAsignatura_ExpedienteGrupoLnk INK ON EE.Id = INK.ExpedienteId and INK.IsDeleted = 0
join InscripcionAsignatura_GrupoInscripcionAsignatura grup on ink.GrupoInscripcionId = grup.Id and grup.IsDeleted = 0 and grup.EtapaInscripcionAsignaturaId = 351 
left join Expediente_Inscripcion EI on EI.ExpedienteId = EE.id AND EI.IsAnulada = 0 AND EI.IsDeleted = 0 --and EI.EtapaInscripcionAsignaturaId = 351 
GROUP BY grup.Numero
order by grup.Numero
```

- setear columnas de la misma tabla
```sql
update t1
set t1.Edificio = CONVERT(VARCHAR,tmp.edificio),t1.UsuarioIdModificacion =1 , t1.FechaModificacion = GETDATE()
from Planificacion_Seccion t1
join #TMP tmp ON TMP.id = t1.Id
```

- Reporte de ayudantes
```sql
select --i.id,pa.id,pa.AnoPeriodo,pa.NumeroPeriodo,
p.id, p.rut RutAyudante, p.Nombre NombreAyudante, p.ApellidoPaterno ApellidoPaternoAyudante, p.ApellidoMaterno ApellidoMaternoAyudante, 
case when a.Email is null then p.EmailUai else a.Email end EmailUaiAyudante,
p.Email CorreoPersonal
from Planificacion_Seccion s
inner join Planificacion_PeriodoAcademico PA on pa.id=s.PeriodoAcademicoId and pa.UnidadAcademicaId in (1,2) and pa.IsDeleted=0
inner join Planificacion_LinkSeccionInstructor LSI on LSI.SeccionId=s.id and LSI.IsDeleted=0
inner join Planificacion_Instructor I on lsi.InstructorId=i.id and i.IsDeleted=0 and i.TipoRolId=5
inner join common_persona p on p.id=i.PersonaId and p.IsDeleted=0
left join Expediente_Alumno a on a.PersonaId=p.id and a.IsDeleted=0
where pa.id>=3150 -- periodo academico
and s.IsDeleted=0
--y que el ayudante no haya sido ayudante antes en cualquier periodo anterior al 2021
and not exists (select i.id
                from Planificacion_Seccion sx
                inner join Planificacion_PeriodoAcademico PAx on pax.id=sx.PeriodoAcademicoId and pax.IsDeleted=0
                inner join Planificacion_LinkSeccionInstructor LSIx on LSIx.SeccionId=sx.id and LSIx.IsDeleted=0
                inner join Planificacion_Instructor Ix on lsix.InstructorId=ix.id and ix.IsDeleted=0 and ix.TipoRolId=5
                where pax.id<=3150 
                and sx.IsDeleted=0
                and ix.id=i.id)
```

- Administracion DBA -- REVISAR BLOQUEOS
```sql
SELECT session_id ,status ,blocking_session_id,
wait_type ,wait_time ,wait_resource ,transaction_id 
FROM sys.dm_exec_requests WHERE status = N'suspended';

SELECT session_id, wait_duration_ms, wait_type, blocking_session_id 
FROM sys.dm_os_waiting_tasks WHERE blocking_session_id <> 0

SELECT *
FROM sys.dm_exec_sessions WHERE session_id = 71
```

- Reporte de Notas
```sql
select ps.Id IdSeccion,
ASIG.Sigla SIGLA,
NASIG.Nombre NOMBRE,
PS.NumeroSeccion NumeroSeccion,
ua.Nombre UnidadAcademica,
ee.Id IdExpediente,
CP.Rut RUT,
CP.DigitoVerificador DIGITO,
CP.Nombre,
CP.ApellidoPaterno,
CP.ApellidoMaterno,
IE.Nombre,
CAL.Nota
from Expediente_Expediente EE
JOIN Expediente_Alumno EA ON EE.AlumnoId = EA.Id AND EA.IsDeleted = 0 
JOIN Common_Persona CP ON EA.PersonaId =CP.Id AND CP.IsDeleted = 0
JOIN Expediente_Inscripcion EI ON EE.Id = EI.ExpedienteId AND EI.IsAnulada = 0 AND EI.IsDeleted = 0
JOIN Planificacion_Seccion PS ON EI.SeccionId = PS.Id AND PS.IsDeleted = 0
JOIN Core_Asignatura ASIG ON PS.AsignaturaId = ASIG.Id AND ASIG.IsDeleted = 0
LEFT JOIN Core_NombreAsignatura NASIG ON ASIG.NombreAsignaturaVigenteId = NASIG.ID
JOIN Planificacion_PeriodoAcademico PA ON PS.PeriodoAcademicoId = PA.Id AND PS.IsDeleted =0 
join Core_UnidadAcademica UA ON PA.UnidadAcademicaId = UA.Id AND UA.IsDeleted = 0
JOIN RegistrosAcademicos_InstrumentoEvaluacion IE ON PS.Id = EI.SeccionId AND IE.IsDeleted = 0
JOIN RegistrosAcademicos_Calificacion CAL ON IE.Id = CAL.InstrumentoEvaluacionId AND CAL.InscripcionId = EI.Id AND CAL.IsDeleted = 0
WHERE PA.Id IN (2755,2782) AND EE.IsDeleted = 0 --and cp.Rut = 19908308
AND UA.Id IN (1,2)
```

- Usar columnas de excel para hacer tablas temporales
```xlsx
create table #tmp(idExpCarrera int,IdCombinacion int,IdReglamento int)
insert into #tmp =""&B2&","&C2&","&D2&""
```
