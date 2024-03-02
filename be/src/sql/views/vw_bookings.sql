create view vw_bookings
as
select b.id,
    b.consignment_no,
    b.sender_name as sender,
    b.receiver_name as receiver,
    b.ref_no,
    b.payment_mode,
    b.origin_id,
    o.name as origin,
    b.destination_id,
    d.name as destination,
    b.status,
    c.name as current_location,
    b.comment
from bookings b
join locations o on o.id = b.origin_id
join locations d on d.id = b.destination_id
left join locations c on c.id = b.current_location_id;
