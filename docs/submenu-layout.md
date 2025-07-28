# SubMenuLayout - Документация

## Описание

`SubMenuLayout` - это layout для разделов с подразделами, который отображает боковое подменю и основной контент.

## Использование

### 1. Настройка роутера

Для разделов с подменю нужно:

1. Установить `hasSubMenu: true` в meta маршрута
2. Использовать `SubMenuLayout` как компонент
3. Добавить дочерние маршруты в `children`

```typescript
{
	path: "/directories",
	name: "Directories",
	meta: { title: "Справочники", icon: "database.svg", hasSubMenu: true },
	component: () => import("@layouts/SubMenuLayout.vue"),
	children: [
		{
			path: "",
			name: "DirectoriesIndex",
			redirect: "/directories/equipment",
		},
		{
			path: "equipment",
			name: "DirectoriesEquipment",
			meta: { title: "Оборудование", icon: "settings.svg" },
			component: () => import("@features/directories/view/EquipmentPage.vue"),
		},
		// ... другие подразделы
	],
}
```

### 2. Создание страниц подразделов

Создайте компоненты страниц в папке `view`:

```
src/features/directories/
└── view/
    ├── EquipmentPage.vue
    ├── MaterialsPage.vue
    └── ClimatePage.vue
```

### 3. Автоматическая генерация подменю

SubMenuLayout автоматически получает данные подменю из конфигурации роутера. Никаких дополнительных настроек не требуется - просто добавьте `hasSubMenu: true` в meta родительского маршрута и создайте дочерние маршруты с meta данными.

## Структура компонентов

### SubMenu.vue

Компонент для отображения бокового меню с:

-   Списком подразделов с иконками
-   Активным состоянием для текущего маршрута

### SubMenuLayout.vue

Layout компонент, который:

-   Работает как обертка внутри MainLayout (из App.vue)
-   Отображает SubMenu слева
-   Размещает дочерние маршруты справа через `<router-view />`
-   Автоматически получает данные подменю из конфигурации роутера

## Стилизация

Подменю использует Tailwind CSS классы:

-   `bg-white rounded-xl p-6 mb-4 shadow-sm` - контейнер

-   `flex items-center gap-3 px-4 py-3 rounded-lg` - пункты меню
-   `hover:bg-gray-50 hover:text-gray-900 transition-colors` - hover эффекты
-   `bg-blue-500 text-white hover:bg-blue-600` - активное состояние
-   `w-80 flex-shrink-0` - фиксированная ширина (320px)

## Архитектура

```
App.vue (MainLayout + router-view)
├── Обычные страницы → компонент страницы
└── Страницы с подменю → SubMenuLayout (обертка с SubMenu + router-view)
    ├── SubMenu (слева)
    └── Дочерние маршруты (справа)
```

## Типы

```typescript
interface SubMenuItem {
    path: string;
    title: string;
    icon?: string;
}

interface SubMenuConfig {
    title: string;
    items: SubMenuItem[];
}
```
