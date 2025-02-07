DROP VIEW least_preciese_birthdate;
CREATE ALGORITHM = UNDEFINED DEFINER = `rksd` @`%` SQL SECURITY DEFINER VIEW `least_preciese_birthdate` AS
select
    `bdv`.`person_id` AS `person_id`,
    min(`bdv`.`born_on_or_after`) AS `earliest possible date`,
    max(`bdv`.`born_on_or_before`) AS `latest possible date`
from
    `student_birth_date_value` `bdv`
group by
    `bdv`.`person_id`