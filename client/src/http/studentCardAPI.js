import $api from "./index"

export const uploadFile = async (file) => {
    const {data} = await $api.post('/student/upload', file)
    return data
}

export const fetchFile = async (fyle) => {
    const {data} = await $api.post('/student/upload')
    return data
}