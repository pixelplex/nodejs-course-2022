# Домашнее задание

## Занятие 6

- Обдумать, какие сущности будут фигурировать в приложении, а также какие связи возникнут между сущностями.
- Описать их по следующей схеме:
``` ts
ENTITIES

1. User:
{
    id: number,
    name: string,
    birthDate: Date
}

2. Address:
{
    id: number,
    userId: number,
    country: string,
    city: string,
    street: string,
    houseNumber: number,
    postalCode: string,
}
```
``` ts
RELATIONS

1. User - Address: one-to-many relation
User.id(PK) - Address.userId(FK)

```

Для связей many-to-many описать структуру join-таблицы.

# Домашнее задание

## Занятие 7

- Составить запросы, которые создают структуру базы, описанную в предыдущем задании.
- Создать реквест, состоящий из файла с расширением sql, включающего необходимые запросы, а также скриншот ER-диаграммы (автоматически генерируется в DBeaver)
