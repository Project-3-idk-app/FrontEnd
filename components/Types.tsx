export type User = {
    id: string;
    username: string;
    email: string;
    picture: string;
    //The rest we dont really care about for our db, but are given by google
    given_name?: string;
    verified_email?: boolean;
    name?: string;
    family_name?: string;
    hd?: string;
};

export const fakeuser: User = {
    id: "1",
    username: "hbox",
    email: "example@gmail.com",
    picture: "https://yt3.googleusercontent.com/ytc/AIdro_nAQSpke2TuTIcm6donidgAH2BHGc-HyOzPptIjiU82tg=s160-c-k-c0x00ffffff-no-rj"
}