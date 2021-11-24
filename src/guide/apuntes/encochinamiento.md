# Encochinamiento Objects
---

- Encochinar Expediente

```sql
INSERT INTO omegapm..markedobjects
select distinct S.ServerId, 'OMEGACore.Model.Expediente.Expediente', ex.id 
from omegapm.dbo.Servers S, Expediente_Expediente ex  with(nolock)
where S.Enabled = 1 and Ex.id = -- ID DE LA TABLA
```

- Encochinar Planificacion Sesion

```sql
INSERT INTO omegapm..markedobjects
select distinct S.ServerId, 'OMEGACore.Model.Planificacion.Sesion', ex.id 
from omegapm.dbo.Servers S, Planificacion_Sesion ex  with(nolock)
where S.Enabled = 1 and ex.Id = 443059
```

- Encochinar HorarioSeccion

```sql
INSERT INTO omegapm..markedobjects
select distinct S.ServerId, 'OMEGACore.Model.Planificacion.HorarioSeccion', ex.id 
from omegapm.dbo.Servers S, Planificacion_HorarioSeccion ex  with(nolock)
where S.Enabled = 1 and ex.Id = 131031
```

- Encochinar Seccion

```sql
INSERT INTO omegapm..markedobjects
select distinct S.ServerId, 'OMEGACore.Model.Planificacion.Seccion', ex.id 
from omegapm.dbo.Servers S, Planificacion_Seccion ex  with(nolock)
where S.Enabled = 1 and ex.Id = 73279
```