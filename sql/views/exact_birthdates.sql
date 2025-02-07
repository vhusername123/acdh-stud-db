DROP VIEW exact_birthdates;
CREATE ALGORITHM = UNDEFINED DEFINER = `rksd` @`%` SQL SECURITY DEFINER VIEW `exact_birthdates` AS
select
    `student_birth_date_value`.`id` AS `id`,
    `student_birth_date_value`.`person_id` AS `person_id`,
    `student_birth_date_value`.`born_on_or_after` AS `born_on`
from `student_birth_date_value`
where
    `student_birth_date_value`.`born_on_or_after` = `student_birth_date_value`.`born_on_or_before`