# Negocio SQL
---

- Creacion de Encuestas Profesores

```sql
select * FROM [dbo].[Omega_EncuestaOmegaVersion] -- Crear version 2021 Asociado a encuestaid=3
insert into [Omega_EncuestaOmegaVersion] values (3,1,0,GETDATE(),GETDATE(),GETDATE()+24,9,'Encuesta de Transferencia de Investigación a la Docencia 2021')
insert into [Omega_EncuestaOmegaVersion] values (1,1,0,GETDATE(),GETDATE(),GETDATE()+24,9,'Encuesta Área Investigación 2021')
select * FROM [dbo].[Omega_EncuestaOmegaPoblacion] -- Se debe crear una nueva población y asociaro a la tabla Omega_EncuestaOmegaVersion
insert into [Omega_EncuestaOmegaPoblacion] values ('Encuesta de Transferencia de Investigación a la Docencia 2021',GETDATE(),1,0)
insert into [Omega_EncuestaOmegaPoblacion] values ('Encuesta Área Investigación 2021',GETDATE(),1,0)
select * FROM [dbo].[Omega_EncuestaOmegaPoblacionUsuarios] order by 1 desc-- where UsuarioId = 2449 --  mario.vergara@uai.cl
insert into [Omega_EncuestaOmegaPoblacionUsuarios] values (9,2449,0) --  mario.vergara@uai.cl
```
