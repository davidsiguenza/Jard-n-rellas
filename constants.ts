import { TreeStatus, TreeSize } from './types';

export const TREE_NAMES: Map<number, string> = new Map([
    [1, "Ciruelo de Jardín"], [2, "Cerezo"], [3, "Camelio"], [4, "Acebo"], [5, "Maganolia"],
    [6, "Magnolio"], [7, "Prunus Péndula"], [8, "Liquidambar"], [9, "Grevillea Robusta"], [10, "???"],
    [11, "Arce Rojo"], [12, "Limonero"], [13, "Ginko Biloba"], [14, "Cornus Florida"], [15, "Naranjo"],
    [16, "Albizia / Acacia de Constatinopla"], [17, "Bambú"], [18, "Olivo"], [19, "Arce Japónico"], [20, "Rododendro"],
    [21, "Glicinia Arbórea"], [22, "Araucaria"], [23, "Cedro del Líbano"], [24, "Cercis (Árbol del Amor)"], [25, "Arce"],
    [26, "Mimosa"], [27, "Alcornoque"], [28, "Roble Europeo"], [29, "Roble Americano"], [30, "Madroño"],
    [31, "Grosella Espinosa"], [32, "Cerezo Negro / Fresno"], [33, "Manzano"], [34, "Pexegueiro"], [35, "Peral"],
    [36, "Cerezo"], [37, "Membrillo"], [38, "Nogal"], [39, "Melocotón"], [40, "Castaño"],
    [41, "Claudia (Ciruelo)"], [42, "Yema (Ciruelo)"], [43, "Mirabel (Ciruelo)"], [44, "Ciruelo"]
]);

export const MAP_IMAGE_URL = "https://storage.googleapis.com/generative-ai-projen-dev-public/user-assets/garden-map-background.png";