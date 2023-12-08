import KamApi from "../src";


const api = new KamApi(true, false, "")

api.getForms("123")
    .then((value) => {
        console.log(value)
    })
