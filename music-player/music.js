class Music {
    constructor(title, singer, img, file) {
        this.title = title;
        this.singer = singer;
        this.img = img;
        this.file = file;
    }

    getName() {
        return this.title + " - " + this.singer;
    }
}


const musicList = [
    new Music("Starships", "Nicki Minaj","1.jpg","1.mp3"),    
    new Music("Freaks", "Surf Curse","2.jpeg","2.mp3"),    
    new Music("One Dance", "Drake","3.jpeg","3.mp3")    
];
