export const selectors = {
    mainFeed: "._1OVBBWLtHoSPfGCRaPzpTf",
    sideBar: "._3Kd8DQpBIbsr5E1JcrMFTY",
    comments: "._2M2wOqmeoPVvcSsJ6Po9",
    userFeed: "._31N0dvxfpsO6Ur5AKx4O5d",
    search: "._3Up38k81YNBWQoW1ovMU88",
    all: "._3ozFtOe6WpJEMUtxDOIvtU",
    popular: "._3ozFtOe6WpJEMUtxDOIvtU",
    subFeed: "._3ozFtOe6WpJEMUtxDOIvtU",
    post: "._2DJXORCrmcNpPTSq0LqL6i",
};

export interface BlockSection {
    selector: string;
    show: boolean;
    useBlocker: boolean;
    blockMsg: string;
}

const mainFeed: BlockSection = {
    selector: "", // ._1OVBBWLtHoSPfGCRaPzpTf
    show: true,
    useBlocker: false,
    blockMsg: "",
};

const sideBar: BlockSection = {
    selector: "._3Kd8DQpBIbsr5E1JcrMFTY",
    show: true,
    useBlocker: false,
    blockMsg: "",
};

const comments: BlockSection = {
    selector: "._2M2wOqmeoPVvcSsJ6Po9-V",
    show: true,
    useBlocker: false,
    blockMsg: "",
};

const userFeed: BlockSection = {
    selector: "", // ._31N0dvxfpsO6Ur5AKx4O5d
    show: true,
    useBlocker: false,
    blockMsg: "",
};

const search: BlockSection = {
    selector: "._3Up38k81YNBWQoW1ovMU88",
    show: true,
    useBlocker: false,
    blockMsg: "",
};

const subFeed: BlockSection = {
    selector: "", // ._31N0dvxfpsO6Ur5AKx4O5d
    show: true,
    useBlocker: false,
    blockMsg: "",
};

const post: BlockSection = {
    selector: "._2rszc84L136gWQrkwH6IaM",
    show: true,
    useBlocker: false,
    blockMsg: "",
};

const popular: BlockSection = {
    selector: "",
    show: true,
    useBlocker: false,
    blockMsg: "",
};

export const sections = {
    mainFeed,
    sideBar,
    search,
    popular,
    subFeed,
    userFeed,
    post,
    comments,
};
