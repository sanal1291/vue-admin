import Vue from 'vue'

import {
    NavPlugin,
    LayoutPlugin,
    NavbarPlugin,
    FormInputPlugin,
    ButtonPlugin,
    CardPlugin,
    ListGroupPlugin,
    FormPlugin,
    InputGroupPlugin,
    FormGroupPlugin,
    OverlayPlugin,
    FormFilePlugin,
    ImagePlugin,
    BTable,
    FormCheckboxPlugin,
    ToastPlugin,
    FormDatepickerPlugin,
    PaginationPlugin,
    SpinnerPlugin,
    LinkPlugin,
    // icons
    BIcon,
    BIconArrowLeft,
    BIconPerson,
    BIconKey,
    BIconLayers,
    BIconPlus,
    BIconTrash,
    BIconArrowUp,
    BIconJustify,
    BIconChevronBarUp,
    BIconChevronBarDown,
    BIconBoxSeam,
    BIconBasket,
    BIconGrid,
    BIconLayersHalf,
    BIconArrowRight,
} from 'bootstrap-vue'
import '../styles/base.scss'

Vue.use(NavPlugin)
Vue.use(LayoutPlugin)
Vue.use(NavbarPlugin)
Vue.use(FormInputPlugin)
Vue.use(ButtonPlugin)
Vue.use(CardPlugin)
Vue.use(ListGroupPlugin)
Vue.use(FormPlugin)
Vue.use(InputGroupPlugin)
Vue.use(FormGroupPlugin)
Vue.use(OverlayPlugin)
Vue.use(FormFilePlugin)
Vue.use(ImagePlugin)
Vue.use(SpinnerPlugin)
Vue.use(LinkPlugin)
Vue.component('b-table', BTable)
Vue.use(FormCheckboxPlugin)
Vue.use(ToastPlugin)
Vue.use(FormDatepickerPlugin)
Vue.use(PaginationPlugin)
Vue.component('BIcon', BIcon)
Vue.component('BIconPerson', BIconPerson)
Vue.component('BIconKey', BIconKey)
Vue.component('BIconArrowLeft', BIconArrowLeft)
Vue.component('BIconLayers', BIconLayers)
Vue.component('BIconPlus', BIconPlus)
Vue.component('BIconTrash', BIconTrash)
Vue.component('BIconArrowUp', BIconArrowUp)
Vue.component('BIconJustify', BIconJustify)
Vue.component('BIconChevronBarUp', BIconChevronBarUp)
Vue.component('BIconChevronBarDown', BIconChevronBarDown)
Vue.component('BIconBoxSeam', BIconBoxSeam)
Vue.component('BIconBasket', BIconBasket)
Vue.component('BIconGrid', BIconGrid)
Vue.component('BIconLayersHalf', BIconLayersHalf)
Vue.component('BIconArrowRight', BIconArrowRight)
