import { Language } from './types';

export interface TreeInfo {
  genus?: {
    [key in Language]: string;
  };
  common: {
    [key in Language]: string;
  };
  scientific: string;
  origin: {
    [key in Language]: string;
  };
  notes: {
    [key in Language]: string;
  };
}

export const TREE_NAMES: Map<number, TreeInfo> = new Map([
    [1, { 
        genus: { es: "Ciruelo", gl: "Ameixeira" },
        common: { es: "de Jardín", gl: "de Xardín" }, 
        scientific: "Prunus domestica",
        origin: { es: "Región del Cáucaso, Asia Menor.", gl: "Rexión do Cáucaso, Asia Menor." },
        notes: { es: "Uno de los árboles frutales más cultivados en regiones templadas. Sus frutos, las ciruelas, se consumen frescas, secas o en mermelada.", gl: "Unha das árbores froiteiras máis cultivadas en rexións temperadas. Os seus froitos, as ameixas, consúmense frescas, secas ou en marmelada." }
    }],
    [2, { 
        genus: { es: "Cerezo", gl: "Cerdeira" },
        common: { es: "Cerezo", gl: "Cerdeira" }, 
        scientific: "Prunus avium",
        origin: { es: "Europa y Asia Occidental.", gl: "Europa e Asia Occidental." },
        notes: { es: "Además de sus populares frutos, su madera es muy apreciada en ebanistería por su tono rojizo y su grano fino.", gl: "Ademais dos seus populares froitos, a súa madeira é moi apreciada en ebanistería polo seu ton avermellado e o seu gran fino." }
    }],
    [3, { 
        common: { es: "Camelio", gl: "Camelia" }, 
        scientific: "Camellia japonica",
        origin: { es: "Asia Oriental (China, Japón, Corea).", gl: "Asia Oriental (China, Xapón, Corea)." },
        notes: { es: "Conocida como la 'flor de Galicia' por su espectacular floración invernal. Es el emblema de las Rías Baixas.", gl: "Coñecida como a 'flor de Galicia' pola súa espectacular floración invernal. É o emblema das Rías Baixas." }
    }],
    [4, { 
        common: { es: "Acebo", gl: "Acivro" }, 
        scientific: "Ilex aquifolium",
        origin: { es: "Nativo de Europa, Norte de África y Asia Occidental.", gl: "Nativo de Europa, Norte de África e Asia Occidental." },
        notes: { es: "Especie protegida en muchas partes de Europa. Sus bayas rojas son un símbolo tradicional de la Navidad.", gl: "Especie protexida en moitas partes de Europa. As súas bagas vermellas son un símbolo tradicional do Nadal." }
    }],
    [5, { 
        genus: { es: "Magnolia", gl: "Magnolia" },
        common: { es: "Magnolia", gl: "Magnolia" }, 
        scientific: "Magnolia grandiflora",
        origin: { es: "Sudeste de Estados Unidos.", gl: "Sueste de Estados Unidos." },
        notes: { es: "Sus grandes y fragantes flores blancas son un espectáculo en verano. Es un árbol de gran porte y hoja perenne.", gl: "As súas grandes e fragrantes flores brancas son un espectáculo no verán. É unha árbore de gran porte e folla perenne." }
    }],
    [6, { 
        genus: { es: "Magnolia", gl: "Magnolia" },
        common: { es: "Magnolio", gl: "Magnolia" }, 
        scientific: "Magnolia grandiflora",
        origin: { es: "Sudeste de Estados Unidos.", gl: "Sueste de Estados Unidos." },
        notes: { es: "Misma especie que la Magnolia, a menudo se usa 'Magnolio' para referirse al árbol. Sus flores son un símbolo de dignidad y nobleza.", gl: "Mesma especie que a Magnolia. As súas flores son un símbolo de dignidade e nobreza." }
    }],
    [7, { 
        common: { es: "Prunus Péndula", gl: "Cerdeira Chorona" }, 
        scientific: "Prunus subhirtella 'Pendula'",
        origin: { es: "Japón.", gl: "Xapón." },
        notes: { es: "Variedad de cerezo ornamental muy apreciada por sus ramas colgantes ('lloronas') que se cubren de flores rosadas en primavera.", gl: "Variedade de cerdeira ornamental moi apreciada polas súas ramas colgantes ('choronas') que se cobren de flores rosadas na primavera." }
    }],
    [8, { 
        common: { es: "Liquidambar", gl: "Liquidámbar" }, 
        scientific: "Liquidambar styraciflua",
        origin: { es: "Este de Norteamérica.", gl: "Leste de Norteamérica." },
        notes: { es: "Famoso por su espectacular coloración otoñal, con hojas que van del amarillo al rojo intenso y púrpura.", gl: "Famoso pola súa espectacular coloración outonal, con follas que van do amarelo ao vermello intenso e púrpura." }
    }],
    [9, { 
        common: { es: "Grevillea Robusta", gl: "Grevillea Robusta" }, 
        scientific: "Grevillea robusta",
        origin: { es: "Costa este de Australia.", gl: "Costa leste de Australia." },
        notes: { es: "También conocido como 'roble sedoso'. Produce flores naranjas muy llamativas y atrae a las aves.", gl: "Tamén coñecido como 'carballo sedoso'. Produce flores laranxas moi rechamantes e atrae aos paxaros." }
    }],
    [10, { 
        common: { es: "???", gl: "???" }, 
        scientific: "N/A",
        origin: { es: "", gl: "" },
        notes: { es: "", gl: "" }
    }],
    [11, { 
        genus: { es: "Arce", gl: "Pradairo" },
        common: { es: "Rojo", gl: "Vermello" }, 
        scientific: "Acer rubrum",
        origin: { es: "Este de Norteamérica.", gl: "Leste de Norteamérica." },
        notes: { es: "Uno de los árboles más comunes y extendidos de su región nativa. Como su nombre indica, destaca por el color rojo de sus hojas en otoño.", gl: "Unha das árbores máis comúns e estendidas da súa rexión nativa. Como o seu nome indica, destaca pola cor vermella das súas follas no outono." }
    }],
    [12, { 
        common: { es: "Limonero", gl: "Limoeiro" }, 
        scientific: "Citrus limon",
        origin: { es: "Sudeste asiático.", gl: "Sueste asiático." },
        notes: { es: "Puede florecer y dar frutos durante todo el año. Sus limones son apreciados por su jugo y su cáscara aromática.", gl: "Pode florecer e dar froitos durante todo o ano. Os seus limóns son apreciados polo seu zume e a súa casca aromática." }
    }],
    [13, { 
        common: { es: "Ginkgo Biloba", gl: "Xinkgo" }, 
        scientific: "Ginkgo biloba",
        origin: { es: "China.", gl: "China." },
        notes: { es: "Considerado un 'fósil viviente', es una especie única sin parientes vivos cercanos. Es extremadamente resistente a la contaminación.", gl: "Considerado un 'fósil vivente', é unha especie única sen parentes vivos próximos. É extremadamente resistente á contaminación." }
    }],
    [14, { 
        common: { es: "Cornus Florida", gl: "Sanguinario de Florida" }, 
        scientific: "Cornus florida",
        origin: { es: "Este de Norteamérica.", gl: "Leste de Norteamérica." },
        notes: { es: "Lo que parecen grandes pétalos blancos o rosas son en realidad brácteas (hojas modificadas) que rodean las pequeñas flores amarillas.", gl: "O que parecen grandes pétalos brancos ou rosas son en realidade brácteas (follas modificadas) que rodean as pequenas flores amarelas." }
    }],
    [15, { 
        common: { es: "Naranjo", gl: "Laranxeira" }, 
        scientific: "Citrus sinensis",
        origin: { es: "Sudeste asiático.", gl: "Sueste asiático." },
        notes: { es: "El naranjo dulce es uno de los árboles frutales más cultivados del mundo. Su flor, el azahar, es muy fragante.", gl: "A laranxeira doce é unha das árbores froiteiras máis cultivadas do mundo. A súa flor, o azahar, é moi fragante." }
    }],
    [16, { 
        common: { es: "Albizia / Acacia de Constantinopla", gl: "Albizia / Acacia de Constantinopla" }, 
        scientific: "Albizia julibrissin",
        origin: { es: "Desde Irán hasta el este de Asia.", gl: "Dende Irán ata o leste de Asia." },
        notes: { es: "Conocida como 'árbol de la seda'. Sus flores parecen pompones rosados y sus hojas se pliegan por la noche.", gl: "Coñecida como 'árbore da seda'. As súas flores parecen pompóns rosados e as súas follas préganse pola noite." }
    }],
    [17, { 
        common: { es: "Bambú", gl: "Bambú" }, 
        scientific: "Bambusoideae",
        origin: { es: "Diversas regiones de Asia, América y África.", gl: "Diversas rexións de Asia, América e África." },
        notes: { es: "Técnicamente, el bambú es una hierba, no un árbol. Es una de las plantas de más rápido crecimiento del mundo.", gl: "Tecnicamente, o bambú é unha herba, non unha árbore. É unha das plantas de máis rápido crecemento do mundo." }
    }],
    [18, { 
        common: { es: "Olivo", gl: "Oliveira" }, 
        scientific: "Olea europaea",
        origin: { es: "Cuenca del Mediterráneo.", gl: "Cunca do Mediterráneo." },
        notes: { es: "Símbolo de paz y sabiduría en la cultura mediterránea. Puede vivir miles de años. De su fruto, la aceituna, se extrae el aceite.", gl: "Símbolo de paz e sabedoría na cultura mediterránea. Pode vivir miles de anos. Do seu froito, a oliva, extráese o aceite." }
    }],
    [19, { 
        genus: { es: "Arce", gl: "Pradairo" },
        common: { es: "Japonés", gl: "Xaponés" }, 
        scientific: "Acer palmatum",
        origin: { es: "Japón, Corea y China.", gl: "Xapón, Corea e China." },
        notes: { es: "Muy valorado en jardinería por la belleza de sus hojas palmeadas y su vibrante coloración otoñal. Existen cientos de cultivares.", gl: "Moi valorado en xardinería pola beleza das súas follas palmeadas e a súa vibrante coloración outonal. Existen centos de cultivares." }
    }],
    [20, { 
        common: { es: "Rododendro", gl: "Rododendro" }, 
        scientific: "Rhododendron",
        origin: { es: "Principalmente Asia, pero también Norteamérica y Europa.", gl: "Principalmente Asia, pero tamén Norteamérica e Europa." },
        notes: { es: "Es un género enorme con más de 1.000 especies. Sus flores son muy vistosas. Las azaleas pertenecen a este género.", gl: "É un xénero enorme con máis de 1.000 especies. As súas flores son moi vistosas. As azaleas pertencen a este xénero." }
    }],
    [21, { 
        common: { es: "Glicinia Arbórea", gl: "Glicinia Arbórea" }, 
        scientific: "Wisteria sinensis",
        origin: { es: "China.", gl: "China." },
        notes: { es: "Es una planta trepadora leñosa, aunque se puede formar como árbol. Sus racimos de flores colgantes son espectaculares y muy perfumados.", gl: "É unha planta trepadora leñosa, aínda que se pode formar como árbore. Os seus acios de flores colgantes son espectaculares e moi perfumados." }
    }],
    [22, { 
        common: { es: "Araucaria", gl: "Araucaria" }, 
        scientific: "Araucaria araucana",
        origin: { es: "Cordillera de los Andes, entre Chile y Argentina.", gl: "Cordilleira dos Andes, entre Chile e Arxentina." },
        notes: { es: "Conocida como 'pino de Chile' o 'árbol rompecabezas de mono'. Es un fósil viviente, con una forma muy característica y prehistórica.", gl: "Coñecida como 'piñeiro de Chile' ou 'árbore crebacabezas de mono'. É un fósil vivente, cunha forma moi característica e prehistórica." }
    }],
    [23, { 
        common: { es: "Cedro del Líbano", gl: "Cedro do Líbano" }, 
        scientific: "Cedrus libani",
        origin: { es: "Montañas de la región Mediterránea, principalmente Líbano.", gl: "Montañas da rexión Mediterránea, principalmente Líbano." },
        notes: { es: "Árbol majestuoso y longevo, símbolo del Líbano. Su madera, aromática y duradera, fue muy codiciada en la antigüedad.", gl: "Árbore maxestosa e lonxeva, símbolo do Líbano. A súa madeira, aromática e duradeira, foi moi cobizada na antigüidade." }
    }],
    [24, { 
        common: { es: "Cercis (Árbol del Amor)", gl: "Árbore do Amor" }, 
        scientific: "Cercis siliquastrum",
        origin: { es: "Sur de Europa y Oeste de Asia.", gl: "Sur de Europa e Oeste de Asia." },
        notes: { es: "Se caracteriza porque sus flores rosas aparecen directamente sobre las ramas y el tronco, antes que las hojas en forma de corazón.", gl: "Caracterízase porque as súas flores rosas aparecen directamente sobre as ramas e o tronco, antes que as follas en forma de corazón." }
    }],
    [25, { 
        genus: { es: "Arce", gl: "Pradairo" },
        common: { es: "Arce", gl: "Pradairo" }, 
        scientific: "Acer",
        origin: { es: "Hemisferio Norte (Asia, Europa, Norteamérica).", gl: "Hemisferio Norte (Asia, Europa, Norteamérica)." },
        notes: { es: "Género muy diverso que incluye desde grandes árboles hasta pequeños arbustos. Famosos por la forma de sus hojas y su savia, de la que se extrae el sirope de arce.", gl: "Xénero moi diverso que inclúe dende grandes árbores ata pequenos arbustos. Famosos pola forma das súas follas e a súa saiba, da que se extrae o xarope de pradairo." }
    }],
    [26, { 
        common: { es: "Mimosa", gl: "Mimosa" }, 
        scientific: "Acacia dealbata",
        origin: { es: "Sudeste de Australia y Tasmania.", gl: "Sueste de Australia e Tasmania." },
        notes: { es: "Florece en invierno, llenando el aire con el aroma de sus pompones amarillos. En Galicia está considerada una especie exótica invasora.", gl: "Florece no inverno, enchendo o aire co aroma dos seus pompóns amarelos. En Galicia está considerada unha especie exótica invasora." }
    }],
    [27, { 
        genus: { es: "Roble", gl: "Carballo" },
        common: { es: "Alcornoque", gl: "Sobreira" }, 
        scientific: "Quercus suber",
        origin: { es: "Suroeste de Europa y Noroeste de África.", gl: "Suroeste de Europa e Noroeste de África." },
        notes: { es: "Su corteza, el corcho, se extrae cada 9-12 años sin dañar el árbol. Es un ecosistema clave en la península ibérica.", gl: "A súa cortiza, a sobreira, extráese cada 9-12 anos sen danar a árbore. É un ecosistema clave na península ibérica." }
    }],
    [28, { 
        genus: { es: "Roble", gl: "Carballo" },
        common: { es: "Europeo", gl: "Europeo" }, 
        scientific: "Quercus robur",
        origin: { es: "Nativo de la mayor parte de Europa.", gl: "Nativo da maior parte de Europa." },
        notes: { es: "El Carballo es el árbol gallego por excelencia, un símbolo de fuerza y longevidad. Forma bosques autóctonos llamados 'carballeiras'.", gl: "O Carballo é a árbore galega por excelencia, un símbolo de forza e lonxevidade. Forma bosques autóctonos chamados 'carballeiras'." }
    }],
    [29, { 
        genus: { es: "Roble", gl: "Carballo" },
        common: { es: "Americano", gl: "Americano" }, 
        scientific: "Quercus rubra",
        origin: { es: "Este de Norteamérica.", gl: "Leste de Norteamérica." },
        notes: { es: "Se diferencia del roble europeo por sus hojas con puntas más afiladas y un crecimiento más rápido. Su madera es menos impermeable.", gl: "Diferénciase do carballo europeo polas súas follas con puntas máis afiadas e un crecemento máis rápido. A súa madeira é menos impermeable." }
    }],
    [30, { 
        common: { es: "Madroño", gl: "Érbedo" }, 
        scientific: "Arbutus unedo",
        origin: { es: "Región Mediterránea y Europa Occidental.", gl: "Rexión Mediterránea e Europa Occidental." },
        notes: { es: "Sus frutos, parecidos a pequeñas fresas, son comestibles y se usan para mermeladas y licores. Curiosamente, flores y frutos maduros coinciden en el árbol.", gl: "Os seus froitos, parecidos a pequenos amorodos, son comestibles e úsanse para marmeladas e licores. Curiosamente, flores e froitos maduros coinciden na árbore." }
    }],
    [31, { 
        common: { es: "Grosella Espinosa", gl: "Groselleira Espiñenta" }, 
        scientific: "Ribes uva-crispa",
        origin: { es: "Europa, Noroeste de África y Suroeste de Asia.", gl: "Europa, Noroeste de África e Suroeste de Asia." },
        notes: { es: "Es un arbusto que produce bayas comestibles, ácidas pero muy aromáticas, ideales para postres y conservas.", gl: "É un arbusto que produce bagas comestibles, acedas pero moi aromáticas, ideais para sobremesas e conservas." }
    }],
    [32, { 
        common: { es: "Cerezo Negro / Fresno", gl: "Cerdeira Negra / Freixo" }, 
        scientific: "Prunus serotina / Fraxinus",
        origin: { es: "Norteamérica (P. serotina) / Hemisferio Norte (Fraxinus).", gl: "Norteamérica (P. serotina) / Hemisferio Norte (Fraxinus)." },
        notes: { es: "El cerezo negro americano (Prunus serotina) es una especie invasora en Europa. El fresno (Fraxinus) es un género de árboles muy común en Galicia.", gl: "A cerdeira negra americana (Prunus serotina) é unha especie invasora en Europa. O freixo (Fraxinus) é un xénero de árbores moi común en Galicia." }
    }],
    [33, { 
        genus: { es: "Manzano", gl: "Maceira" },
        common: { es: "Manzano", gl: "Maceira" }, 
        scientific: "Malus domestica",
        origin: { es: "Asia Central.", gl: "Asia Central." },
        notes: { es: "Existen miles de variedades de manzanas cultivadas en todo el mundo. Galicia tiene una gran tradición en la producción de manzanas para sidra.", gl: "Existen miles de variedades de mazás cultivadas en todo o mundo. Galicia ten unha gran tradición na produción de mazás para sidra." }
    }],
    [34, { 
        genus: { es: "Melocotonero", gl: "Pexegueiro" },
        common: { es: "Pexegueiro", gl: "Pexegueiro" }, 
        scientific: "Prunus persica",
        origin: { es: "China.", gl: "China." },
        notes: { es: "El melocotonero pertenece a la misma familia que las ciruelas y las almendras. Su fruto, el melocotón, es muy apreciado por su pulpa jugosa.", gl: "O pexegueiro pertence á mesma familia que as ameixas e as améndoas. O seu froito, o pexego, é moi apreciado pola súa polpa zumarenta." }
    }],
    [35, { 
        common: { es: "Peral", gl: "Pereira" }, 
        scientific: "Pyrus communis",
        origin: { es: "Europa Central y del Este, y Suroeste de Asia.", gl: "Europa Central e do Leste, e Suroeste de Asia." },
        notes: { es: "Se cultiva desde la antigüedad. Hay muchas variedades de peras, que difieren en tamaño, forma y sabor.", gl: "Cultívase dende a antigüidade. Hai moitas variedades de peras, que difiren en tamaño, forma e sabor." }
    }],
    [36, { 
        genus: { es: "Cerezo", gl: "Cerdeira" },
        common: { es: "Cerezo", gl: "Cerdeira" }, 
        scientific: "Prunus avium",
        origin: { es: "Europa y Asia Occidental.", gl: "Europa e Asia Occidental." },
        notes: { es: "La floración del cerezo es un evento celebrado en muchas culturas, especialmente en Japón (Sakura), como símbolo de la belleza efímera.", gl: "A floración da cerdeira é un evento celebrado en moitas culturas, especialmente no Xapón (Sakura), como símbolo da beleza efémera." }
    }],
    [37, { 
        common: { es: "Membrillo", gl: "Marmeleiro" }, 
        scientific: "Cydonia oblonga",
        origin: { es: "Suroeste de Asia (región del Cáucaso).", gl: "Suroeste de Asia (rexión do Cáucaso)." },
        notes: { es: "Su fruto, el membrillo, es muy duro y ácido para comerlo crudo, pero cocido se convierte en la popular carne de membrillo.", gl: "O seu froito, o marmelo, é moi duro e acedo para comelo cru, pero cocido convértese no popular doce de marmelo." }
    }],
    [38, { 
        common: { es: "Nogal", gl: "Nogueira" }, 
        scientific: "Juglans regia",
        origin: { es: "Desde los Balcanes hasta el Himalaya.", gl: "Dende os Balcáns ata o Himalaia." },
        notes: { es: "Apreciado tanto por sus frutos, las nueces, como por su madera de alta calidad para muebles y ebanistería.", gl: "Apreciado tanto polos seus froitos, as noces, como pola súa madeira de alta calidade para mobles e ebanistería." }
    }],
    [39, { 
        genus: { es: "Melocotonero", gl: "Pexegueiro" },
        common: { es: "Melocotón", gl: "Pexego" }, 
        scientific: "Prunus persica",
        origin: { es: "China.", gl: "China." },
        notes: { es: "En China, el melocotón es un símbolo de inmortalidad y longevidad.", gl: "En China, o pexego é un símbolo de inmortalidade e lonxevidade." }
    }],
    [40, { 
        common: { es: "Castaño", gl: "Castiñeiro" }, 
        scientific: "Castanea sativa",
        origin: { es: "Sur de Europa y Asia Menor.", gl: "Sur de Europa e Asia Menor." },
        notes: { es: "Su fruto, la castaña, fue un alimento básico en muchas zonas de Europa, incluida Galicia, antes de la llegada de la patata. Los 'soutos' (bosques de castaños) son parte del paisaje tradicional gallego.", gl: "O seu froito, a castaña, foi un alimento básico en moitas zonas de Europa, incluída Galicia, antes da chegada da pataca. Os 'soutos' (bosques de castiñeiros) son parte da paisaxe tradicional galega." }
    }],
    [41, { 
        genus: { es: "Ciruelo", gl: "Ameixeira" },
        common: { es: "Claudia", gl: "Claudia" }, 
        scientific: "Prunus domestica subsp. italica",
        origin: { es: "Francia (híbrido).", gl: "Francia (híbrido)." },
        notes: { es: "Es una variedad de ciruela (Reina Claudia) muy apreciada por su dulzura y jugosidad. Su nombre honra a la reina Claudia de Francia.", gl: "É unha variedade de ameixa (Raíña Claudia) moi apreciada pola súa dozura e suculencia. O seu nome honra á raíña Claudia de Francia." }
    }],
    [42, { 
        genus: { es: "Ciruelo", gl: "Ameixeira" },
        common: { es: "Yema", gl: "Xema" }, 
        scientific: "Prunus domestica",
        origin: { es: "Región del Cáucaso, Asia Menor.", gl: "Rexión do Cáucaso, Asia Menor." },
        notes: { es: "Variedad de ciruela, probablemente local o de nombre popular, que pertenece a la especie común de ciruelo.", gl: "Variedade de ameixa, probablemente local ou de nome popular, que pertence á especie común de ameixeira." }
    }],
    [43, { 
        genus: { es: "Ciruelo", gl: "Ameixeira" },
        common: { es: "Mirabel", gl: "Mirabel" }, 
        scientific: "Prunus domestica subsp. syriaca",
        origin: { es: "Anatolia (actual Turquía).", gl: "Anatolia (actual Turquía)." },
        notes: { es: "Es una variedad de ciruela pequeña, dulce y amarilla, muy popular en Europa Central para hacer licores y mermeladas.", gl: "É unha variedade de ameixa pequena, doce e amarela, moi popular en Europa Central para facer licores e marmeladas." }
    }],
    [44, { 
        genus: { es: "Ciruelo", gl: "Ameixeira" },
        common: { es: "Ciruelo", gl: "Ameixeira" }, 
        scientific: "Prunus domestica",
        origin: { es: "Región del Cáucaso, Asia Menor.", gl: "Rexión do Cáucaso, Asia Menor." },
        notes: { es: "Nombre genérico para el árbol que produce ciruelas. Hay una gran diversidad de variedades adaptadas a diferentes climas.", gl: "Nome xenérico para a árbore que produce ameixas. Hai unha gran diversidade de variedades adaptadas a diferentes climas." }
    }]
]);

export const MAP_IMAGE_URL = "https://storage.googleapis.com/generative-ai-projen-dev-public/user-assets/garden-map-background.png";