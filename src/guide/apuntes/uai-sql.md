# Negocio SQL
---

<img src="/images/bookmark.png">

- eximir de ingles segun archivo enviado por excel
``` sql
CREATE TABLE #Ingles (Id int,
                      Eximir_desde varchar(max),
                      Eximir_hasta varchar(max),
                     )
--cargamos los datos enviados en una tabla temporal
insert into #Ingles select 89183,'ENG001','ENG008'
insert into #Ingles select 89068,'ENG001','ENG008'

    select ex.id expedienteid,
    a.id asignaturaid,
    NM.Id NodoMallaId,
    7 Nota, 
    'Ex. 2022-1' Descripcion,
    GETDATE() FechaEximicion,
    0 IsAnulada,
    1 UsuarioIdCreacion,
    getdate() FechaCreacion,
    1 UsuarioIdModificacion,
    getdate() FechaModificacion,
    0 IsDeleted,
    A.NombreAsignaturaVigenteId NombreAsignaturaId,
   null IsAnuladoOmega
    into #nodoMallaEng
    from Expediente_Expediente ex
    inner join Expediente_ExpedienteVersionExtraProgramaticoLnk evpl on ex.id=evpl.ExpedienteId
                                                        and evpl.IsDeleted=0
                                                        and evpl.IsAnulada=0
    inner join PlanEstudio_PeriodoMalla pm on evpl.VersionPlanEstudioId=pm.VersionPlanEstudioId
                                        and pm.IsDeleted=0
    inner join PlanEstudio_NodoMalla NM on NM.PeriodoMallaId = PM.Id and NM.IsDeleted = 0 and NM.TipoAsignatura = 2
    inner join PlanEstudio_NodoMallaAsignatura NMA on NMa.NodoMallaId = NM.Id and NMA.IsDeleted = 0
    inner join Core_Asignatura A on A.Id = NMA.AsignaturaId
    inner join #Ingles temp on ex.id=temp.id
    where  a.sigla  like '%ENG%'
    and cast(substring(a.Sigla,6,1) as int) <= cast(substring(Eximir_hasta,6,1) as int)
    order by ex.id desc

    insert into Expediente_Eximicion
    select  expedienteid,
     asignaturaid,
    NodoMallaId,
     Nota,
     Descripcion,
    FechaEximicion,
    IsAnulada,
     UsuarioIdCreacion,
    FechaCreacion,
     UsuarioIdModificacion,
     FechaModificacion,
    IsDeleted,
    NombreAsignaturaId,
	IsAnuladoOmega
    from #nodoMallaEng


    INSERT INTO omegapm..markedobjects
    SELECT distinct serverid, 'OMEGACore.Model.Expediente.Eximicion',Ex.Id
    FROM omegapm..servers S, Expediente_Eximicion Ex
    WHERE S.enabled = 1
    and Ex.ExpedienteId in (select Id from #Ingles)
    and NombreAsignaturaId IN (select NombreAsignaturaId from #nodoMallaEng)


    INSERT INTO omegapm..markedobjects
    SELECT distinct serverid, 'OMEGACore.Model.Expediente.Expediente',Ex.id
    FROM omegapm..servers S, Expediente_Expediente Ex
    WHERE S.enabled = 1
    and Ex.id in (select Id from #Ingles)

    INSERT INTO omegapm..markedobjects
    SELECT serverid, 'OMEGACore.Model.Expediente.Alumno',Ex.id
    FROM omegapm..servers S, Expediente_Alumno Ex
    WHERE S.enabled = 1
    and Ex.id in (select ee.AlumnoId from #Ingles tmp join Expediente_Expediente ee on tmp.id = ee.Id)

    insert into omegalog..Expediente_Eximicion 
    select exe.* from Expediente_Eximicion exe
    inner join #nodoMallaEng nm on exe.expedienteid = nm.expedienteid and exe.nodomallaid = nm.nodomallaid and exe.IsDeleted =0 and exe.UsuarioIdCreacion = 1
```






- Corregir encuestas y plantillas
``` sql
--buscar las conf que fueron eliminadas
--setear el punt de conf de e. a 0 en las secciones
update Planificacion_Seccion
set ConfiguracionEncuestaDocenteId = 0,FechaModificacion = GETDATE(),UsuarioIdModificacion =1
where id in (
select id from Planificacion_Seccion where ConfiguracionEncuestaDocenteId in(27834,17789)
)

--eliminar de esta tabla tambien para poder agregar las secciones a otra conf
update EncuestaDocente_SeccionPlantillaEncuestaDocenteLnk
set IsDeleted = 1 where ConfiguracionEncuestaDocenteId in (27834,17789)
```



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


- Reporte encuesta de investigacion
```sql
select UsuarioId,CP.EmailUai,'Si' Contesto from Omega_EncuestaOmegaPoblacionUsuarios EP
JOIN Seguridad_Usuario SU ON EP.UsuarioId = SU.Id AND SU.IsDeleted = 0
JOIN Common_Persona CP ON SU.PersonaId = CP.Id
WHERE EP.UsuarioId  in (select usuarioid from Omega_EscuestaOmegaProfesores where VersionId = 10)
AND EP.PoblacionId = 10
union all
select UsuarioId,CP.EmailUai,'No' Contesto from Omega_EncuestaOmegaPoblacionUsuarios EP
JOIN Seguridad_Usuario SU ON EP.UsuarioId = SU.Id AND SU.IsDeleted = 0
JOIN Common_Persona CP ON SU.PersonaId = CP.Id
WHERE EP.UsuarioId not in (select usuarioid from Omega_EscuestaOmegaProfesores where VersionId = 10)
AND EP.PoblacionId = 10
```


- Obtiene horario inscripciones segun alumno id
```sql
select  ep.Id idExpediente,ip.Id idInscripcion,hs.Id horarioSeccion,dbo.fnObtiene_HoraHorarioSeccion(mo.HoraInicio)Inicio,dbo.fnObtiene_HoraHorarioSeccion(mo.HoraTermino)Termino,hs.DiaSemana,se.Id seccionId,hs.FechaModificacion,hs.UsuarioIdModificacion
from Expediente_Inscripcion IP with (nolock) 
join Expediente_Expediente ep with (nolock) on ep.Id = IP.ExpedienteId and ep.IsDeleted = 0
join Expediente_Alumno al with (nolock) on al.Id = ep.AlumnoId and al.IsDeleted = 0
join Planificacion_Seccion se with (nolock) on se.Id = ip.SeccionId and se.IsDeleted = 0
join Planificacion_HorarioSeccion hs with (nolock) on hs.SeccionId = se.Id and hs.IsDeleted = 0
join Planificacion_ModuloUnidadAcademica mo with (nolock) on mo.Id = hs.ModuloUnidadAcademicaId and mo.IsDeleted = 0
join Core_Asignatura asi with (nolock) on asi.Id = se.AsignaturaId and asi.IsDeleted = 0
join Core_NombreAsignatura na with (nolock) on na.Id = asi.NombreAsignaturaVigenteId and na.IsDeleted = 0
left join Planificacion_Instructor it with (nolock) on it.Id = se.InstructorId and it.IsDeleted = 0
left join Common_Persona pe with (nolock) on pe.Id = it.PersonaId and pe.IsDeleted = 0
left join Common_Sala sa with (nolock) on hs.SalaId = sa.Id and sa.IsDeleted = 0
where al.Id = 59185
and ip.Estado = 3
and ip.IsAnulada = 0
and ip.IsDeleted = 0
and ep.Estado = 1
```


- Cantidad de inscripciones segun rut enviados por excel y insertados en una tabla temporal
```sql
select CP.Rut,CP.DigitoVerificador[DIGITO]
,INS.ExpedienteId[Expediente ID]
, count(distinct INS.id) [Q Inscripciones Pregrado]
from Expediente_Expediente EE
JOIN Expediente_Alumno EA ON EE.AlumnoId = EA.Id AND EA.IsDeleted = 0
JOIN Common_Persona CP ON EA.PersonaId = CP.Id AND CP.IsDeleted = 0
JOIN #TMP TMP ON TMP.rut = CP.Rut -- join con tabla temporal con ruts
JOIN Expediente_Inscripcion INS ON INS.ExpedienteId = EE.Id	AND INS.IsDeleted = 0
join Planificacion_Seccion SS on SS.id = INS.SeccionId and SS.IsDeleted = 0
join Planificacion_PeriodoAcademico PA on PA.id = SS.PeriodoAcademicoId and PA.IsDeleted = 0 and PA.AnoPeriodo = 2021 and PA.UnidadAcademicaId in (1,2)
WHERE INS.Estado = 3 AND EE.UnidadAcademicaId IN (1,2) AND INS.IsAnulada = 0
group by CP.Rut,CP.DigitoVerificador,INS.ExpedienteId
order by CP.Rut ASC
```

- Funcion que transforma hora desde el INT de omega
```sql
CAST([dbo].fnObtiene_HoraHorarioSeccion(PHC.HoraInicio) AS varchar) [Inicio]
```

- Inscripciones segun su ETAPA ID Y CUALQUEIER PARAMETRO Q SE DESEE SEGUN SUS JOIN
```sql
select top 100 *  from InscripcionAsignatura_EtapaInscripcionAsignatura IE
JOIN InscripcionAsignatura_ConfiguracionInscripcionAsignatura CONF ON IE.ConfiguracionInscripcionAsignaturaId = CONF.Id
JOIN Planificacion_PeriodoAcademico PP ON CONF.PeriodoAcademicoId = PP.Id
JOIN Planificacion_Seccion PS ON PS.PeriodoAcademicoId = PP.Id
JOIN Planificacion_HorarioSeccion PHC ON PHC.SeccionId = PS.Id
where  PS.SeccionCerrada = 0 -- AND PHC.SeccionId = 14777
```

- Trae las ayudantias realizadas por un instructor, y temas de pago por su correo y opcionalmente una sigla de la asignatura
```sql
		SELECT LNK.Id ,ASI.Sigla, NA.Nombre, SE.NumeroSeccion, PA.Nombre PeriodoAcademico, PA.AnoPeriodo Año, SUM(LNK.ValorPago) Monto, UA.CentroDeCosto CentroCosto, LNK.Cobrado
		FROM Expediente_Alumno A
		JOIN Planificacion_Instructor I ON I.PersonaId = A.PersonaId AND I.TipoRolId = 5 AND I.IsDeleted = 0
		JOIN Planificacion_LinkSeccionInstructor LSI ON LSI.InstructorId = I.Id
		JOIN Planificacion_Seccion SE ON SE.Id = LSI.SeccionId AND SE.IsDeleted = 0
		JOIN Core_NombreAsignatura NA ON NA.Id = SE.NombreAsignaturaId AND NA.IsDeleted = 0
		JOIN Core_Asignatura ASI ON ASI.Id = SE.AsignaturaId AND ASI.IsDeleted = 0
		JOIN PagoAyudante_LinkSeccionInstructorMes LNK ON LNK.LinkSeccionInstructorId = LSI.Id AND LNK.IsDeleted = 0  --AND LNK.NumeroMes <= DATEPART(MONTH,GETDATE())
		JOIN Planificacion_PeriodoAcademico PA ON PA.Id = SE.PeriodoAcademicoId AND PA.IsDeleted = 0-- AND PA.AnoPeriodo = DATEPART(YEAR,GETDATE()) AND PA.NumeroPeriodo <> 1
		JOIN Core_UnidadAcademica UA ON UA.Id = PA.UnidadAcademicaId AND UA.IsDeleted = 0
		WHERE A.IsDeleted = 0 AND A.Email = 'alecorrea@alumnos.uai.cl' AND LNK.IsDeleted = 0 AND Sigla ='MAT105'
		GROUP BY LNK.Id ,ASI.Sigla, NA.Nombre, SE.NumeroSeccion, PA.Nombre, PA.AnoPeriodo, UA.CentroDeCosto, PA.Id, LNK.Cobrado
		HAVING SUM(LNK.ValorPago) IS NOT NULL --AND SUM(LNK.ValorPago) > 0
```


- Ver % de avance de ayudantes segun los RUT ENVIADOS 
- tipoRolId de la tabla planificacionInstuctor = (5 = ayudante)
```sql
select EE.Id[Expediente ID]
,CP.Nombre + ' '+ CP.ApellidoPaterno [Nombre]
,EA.Email [Correo]
,CP.Rut[RUT]
,CP.DigitoVerificador [DIGITO VERIFICADOR]
,EEX.DESCRIPCIONESTADO[ESTADO]
,ISNULL(ROUND(EE.PorcentajeAvancePlanEstudio,2),0)[% AVANCE]  
from Common_Persona CP 
JOIN Expediente_Alumno EA ON CP.Id = EA.PersonaId AND EA.IsDeleted = 0
JOIN Expediente_Expediente EE ON EE.AlumnoId = EA.Id AND EE.IsDeleted = 0
join Expediente_EstadoExpediente EEX ON EE.Estado = EEX.IdEstado AND EEX.IdSubEstado = EE.EstadoInactivo
join Planificacion_Instructor PLI ON PLI.PersonaId = CP.Id AND PLI.TipoRolId = 5
where rut IN (19671003,19035029,19488443,19471216,19842262,20847560)
order by cp.Rut desc
```

- Obtiene las inscripciones vigentes de un alumno segun su Expediente ID y su periodoacademico ID
- Ademas trae la informacion de la seccion y el instructor
```sql
select EE.Id[Expediente ID]
,CP.Nombre + ' '+ CP.ApellidoPaterno [Nombre]
,EA.Email [Correo]
,CP.Rut[RUT]
,CP.DigitoVerificador [DIGITO VERIFICADOR]
,EEX.DESCRIPCIONESTADO[ESTADO]
,ISNULL(ROUND(EE.PorcentajeAvancePlanEstudio,2),0)[% AVANCE]  
from Common_Persona CP 
JOIN Expediente_Alumno EA ON CP.Id = EA.PersonaId AND EA.IsDeleted = 0
JOIN Expediente_Expediente EE ON EE.AlumnoId = EA.Id AND EE.IsDeleted = 0
join Expediente_EstadoExpediente EEX ON EE.Estado = EEX.IdEstado AND EEX.IdSubEstado = EE.EstadoInactivo
join Planificacion_Instructor PLI ON PLI.PersonaId = CP.Id AND PLI.TipoRolId = 5
where rut IN (19671003,19035029,19488443,19471216,19842262,20847560)
order by cp.Rut desc
```

- Reporte asistencia deporte Vina
- Ejecutar en Base de datos UAIV
```sql
select distinct NM.Sigla,EE.Id,cp.Nombre,cp.ApellidoPaterno,cp.ApellidoMaterno,cast(cp.Rut as varchar)+'-'+cp.DigitoVerificador [Rut Cumpleto]
		,T1.*from (

					select tbl1.rut[rut],
					tbl1.agosto[Agosto],
					isnull(tb2.agosto,0)[Castigo Agosto],
					tbl1.septiembre[Septiembre],
					isnull(tb2.septiembre,0)[Castigo Septiembre],
					tbl1.octubre[Octubre],
					isnull(tb2.octubre,0)[Castigo Octubre],
					tbl1.noviembre[Noviembre],
					isnull(tb2.noviembre,0)[Castigo Noviembre],
					tbl1.diciembre[Diciembre],
					isnull(tb2.diciembre,0)[Castigo Diciembre],
					tbl1.agosto + tbl1.septiembre + tbl1.octubre + tbl1.noviembre + tbl1.diciembre 
					-isnull(tb2.agosto,0) - isnull(tb2.septiembre,0) - isnull(tb2.octubre,0) - isnull(tb2.noviembre,0) - isnull(tb2.diciembre,0)[Total]
					from [dbo].[tfAsistencia_ObtienePivot]('2021-08-02','2021-12-13') tbl1
					left join [dbo].[tfCastigos_ObtienePivot]('2021-08-02','2021-12-13') tb2 on tbl1.rut = tb2.rut) as T1
JOIN OmegaDB.dbo.Common_Persona CP on t1.rut = cp.Rut AND CP.IsDeleted = 0
JOIN OmegaDB.dbo.Expediente_Alumno EA ON CP.Id = EA.PersonaId AND EA.IsDeleted = 0
JOIN OmegaDB.dbo.Expediente_Expediente EE ON EA.ID = EE.AlumnoId AND EE.Estado =1 AND EE.EstadoInactivo = 1 AND EE.IsDeleted = 0 AND EE.UnidadAcademicaId = 2
JOIN OmegaDB.dbo.Expediente_Inscripcion INS ON EE.Id = INS.ExpedienteId AND INS.IsAnulada =0 AND INS.IsDeleted = 0
JOIN OmegaDB.dbo.Planificacion_Seccion PS ON INS.SeccionId = PS.Id AND PS.SeccionCerrada = 0 AND PS.IsDeleted = 0 AND PS.PeriodoAcademicoId = 3151
JOIN OmegaDB.dbo.PlanEstudio_NodoMalla NM ON INS.NodoMallaId = NM.Id AND NM.TipoAsignatura = 3
ORDER BY [Rut Cumpleto]
```



- Reporte de ayudantes con pagos pendientes
```sql
SELECT  distinct A.Email,CP.Nombre,cp.ApellidoPaterno,cp.ApellidoMaterno,CP.Rut,cp.DigitoVerificador, ASI.Sigla, NA.Nombre, SE.NumeroSeccion, PA.Nombre PeriodoAcademico, PA.AnoPeriodo Año,UA.CentroDeCosto CentroCosto, LNK.Cobrado, UnidadAcademicaId,LNK.Id
FROM Expediente_Alumno A
	 JOIN Common_Persona CP ON A.PersonaId = CP.Id AND CP.IsDeleted = 0
     JOIN Planificacion_Instructor I ON I.PersonaId = A.PersonaId
                                        AND I.TipoRolId = 5
                                        AND I.IsDeleted = 0
     JOIN Planificacion_LinkSeccionInstructor LSI ON LSI.InstructorId = I.Id
     JOIN Planificacion_Seccion SE ON SE.Id = LSI.SeccionId
                                      AND SE.IsDeleted = 0
     JOIN Core_NombreAsignatura NA ON NA.Id = SE.NombreAsignaturaId
                                      AND NA.IsDeleted = 0
     JOIN Core_Asignatura ASI ON ASI.Id = SE.AsignaturaId
                                 AND ASI.IsDeleted = 0
     JOIN PagoAyudante_LinkSeccionInstructorMes LNK ON LNK.LinkSeccionInstructorId = LSI.Id
                                                       AND LNK.IsDeleted = 0
                                                       AND LNK.Cobrado = 0
     JOIN Planificacion_PeriodoAcademico PA ON PA.Id = SE.PeriodoAcademicoId
                                               AND PA.IsDeleted = 0
											   AND PA.ID IN (3150,3151)
     JOIN Core_UnidadAcademica UA ON UA.Id = PA.UnidadAcademicaId
                                     AND UA.IsDeleted = 0
WHERE A.IsDeleted = 0
      AND LNK.IsDeleted = 0
```


-  Insertar tabla ayupre ayudantes periodo de verano
```sql
INSERT INTO Planificacion_Ayupre(PeriodoAcademicoId, Procesado, UsuarioIdCreacion, FechaCreacion, UsuarioIdModificacion, FechaModificacion, IsDeleted, DiaInicioSubidaBoleta, DiaTerminoSubidaBoleta, DiaDeclaracionMontos)
VALUES(3314 , 1 , 1 , GETDATE() , 1 , GETDATE(), 0, 7, 20, 6);
```
---

---

- #### Insertar en tabla Expediente_Expediente
```sql
begin tran x
insert into Expediente_Expediente
select 
	   ea.Id
      ,tp.planId -- planid
      ,0--EE.InformacionFinancieraId
      ,0--EE.IcaAlumnoId
      ,0--EE.CeremoniaId
      ,0--EE.UniversidadIntercambioId
      ,cast(tp.rut as nvarchar(20))+'-'+tp.dv+' - ICOM'--EE.NumeroExpediente
      ,1--EE.Estado
      ,1--EE.EstadoInactivo
      ,'01-01-1900'--EE.FechaEstadoInactivo
      ,''--EE.DescripcionEstadoInactivo
      ,GETDATE()--EE.FechaIngreso
      ,0--EE.Egresado
      ,'01-01-1900'--EE.FechaEgreso
      ,'01-01-1900'--EE.FechaGrado
      ,0--EE.Titulado
      ,'01-01-1900'--EE.FechaTitulacion
      ,0--EE.ProgramaOtorga
      ,0--EE.Ranking
      ,0--EE.RankingEgreso
      ,0--EE.Extranjero
      ,0--EE.Intercambio
      ,0--EE.TipoIntercambio
      ,0--EE.RecibeCorreosMasivos
      ,tp.versionPlanEstudioId --VersionPlanEstudioId
      ,0
      ,0--EE.SituacionAcademicaId
      ,1--EE.UsuarioIdCreacion
      ,GETDATE()--EE.FechaCreacion
      ,1--EE.UsuarioIdModificacion
      ,GETDATE()--EE.FechaModificacion
      ,0--EE.IsDeleted
      ,''--EE.NumeroCarpeta
      ,tp.programaId --EE.ProgramaId
      ,tp.unidadAcademica--EE.UnidadAcademicaId
      ,0--EE.PeriodoIngreso
      ,tp.reglamentoId --EE.ReglamentoId
      ,0--EE.PeriodoAvance -- ############################# ESTE DATO DEBE IR SI O SI, ES EL PeriodoAcademicoId cuando Inicia #############################
      ,null--EncuestaSatisfaccionIdLst
      ,tp.unidadAcademica--EE.UnidadAcademicaInscripcionAsignaturaId
      ,null--DeporteRebajadoIdLst
      ,null--InglesRebajadoIdLst
      ,0 --PeriodoInscripcion
      ,0--EE.PorcentajeAvancePlanEstudio
      ,tp.expedienteCarrera--EE.ExpedienteCarreraId
      ,null--InscripcionRequisitoExtraIdLst
      ,0--EE.TienePeriodoRecuperativo
      ,null--SituacionAcademicaHistoricaIdLst
      ,0--EE.PromedioPonderadoAcumulado
      ,0--EE.PromedioGrado
      ,0--EE.PeriodoAvanceTomaRamos
      ,0
      ,0--EE.EstadoCarrera
      ,0--EE.EstadoGrado
      ,0--EE.ExpedientePrevioExigidoId
      ,0--EE.ExigeExpedientePrevioTerminado
      ,0--EE.TrackHonor
      ,0--EE.TransaccionId
from #tmp tp
join Common_Persona cp on cp.Rut = tp.rut 
join Expediente_Alumno ea on ea.PersonaId = cp.Id 
--rollback
--commit;
```
---