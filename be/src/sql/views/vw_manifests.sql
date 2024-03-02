create view vw_manifests
as
select m.id,
    m.manifest_no,
    m.date,
    m.status,
    m.origin_id,
    o.name as origin,
    m.destination_id,
    d.name as destination
from manifests m
join locations o on m.origin_id = o.id
join locations d on m.destination_id = d.id;
