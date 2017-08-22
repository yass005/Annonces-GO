export interface treeMap {

    name: string;
    scientificName: string;
    famille: string;
    globalImage: string;
    leafImage: string;
    size: number;
    lat: number;
    lng: number;

}

// Mocks

export const TreeMappingMock = [
    {
        'name': 'Sapin',
        'scientificName': 'Abies',
        'famille': 'Pinaceae',
        'globalImage': 'https://media.ooreka.fr/public/image/plant/325/varietyImage/7qradxxw4gsgwc8008ks8g0wg-source-11705053.jpg',
        'leafImage': 'http://viagallica.com/v/img/small/sapin_pectine_029_(feuille)_small.jpg',
        'size': 6,
        'lat':  47.066874,
        'lng': 7.085710
    },
    {
        'name': 'Amandier',
        'scientificName': 'Prunus dulcis',
        'famille': 'Rosaceae',
        'globalImage': 'http://www.amandier68.org/images/b/bel/Bel-amandier.jpg',
        'leafImage': 'https://i.skyrock.net/2501/91542501/pics/3245640632_1_13_AxxhOjGX.jpg',
        'size': 2.3,
        'lat': 47.065475,
        'lng': 7.088907
    },
    {
        'name': 'Poirier',
        'scientificName': 'Pyrus communis',
        'famille': 'Rosaceae',
        'globalImage': 'http://www.greffer.net/discussion//images/uploads/floyd/1340218371-poirier%20AC2.JPG.jpg',
        'leafImage': 'http://aesgsf.free.fr/V5/_media/img/large/pyrus-communis-feuille-by-rabe.jpg',
        'size': 1.6,
        'lat':  47.065153,
        'lng': 7.088714
    },
    {
        'name': 'Oranger',
        'scientificName': 'Citrus sinensis',
        'famille': 'Rutaceae',
        'globalImage': 'http://media.gerbeaud.net/2013/10/640/oranger-pleine-terre.jpg',
        'leafImage': 'http://thierrymartincoutin.free.fr/images/arbresgrand/orangerfeuil.jpg',
        'size': 2.1,
       'lat':  47.065153,
        'lng': 7.088716
    }
]
