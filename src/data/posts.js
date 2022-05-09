export const posts = [

    {
		id: 0,
        name: "Max Lynch",
        sponsored: false,
        time: "12 m",
        avatar: "https://pbs.twimg.com/profile_images/1318970727173885953/bln98FNj_400x400.jpg",
        message: "Join a global community of web native developers!",
        views: "",
        online: true,
    },
    {
		id: 1,
        name: "Ben Sperry",
        sponsored: true,
        image: "https://ionicons.com/assets/img/meta/ionicons-og.png",
        time: "1 h",
        avatar: "https://pbs.twimg.com/profile_images/1328390491126308864/jHHgl5Dm_400x400.jpg",
        message: "Check out all the cool IonIcons used on this IonicBook app!",
        views: "",
        online: false
    },
    {
		id: 2,
        name: "Matt Netkow",
        sponsored: false,
        time: "2 h",
        avatar: "https://pbs.twimg.com/profile_images/1323383930150621187/GKc0nVzi_400x400.jpg",
        message: "I help web developers build cross-platform Web Native apps.",
        views: "",
        online: false
    },
];

export const getPosts = () => posts;