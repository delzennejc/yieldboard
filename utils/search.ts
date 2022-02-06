import { RequestsModelType } from "../store/store.model";

export const searchInRequests = (reqs: RequestsModelType[], search: string) => {
    return reqs.filter(req => {
        const isName = req.name.toLowerCase().includes(search.toLowerCase())
        const isEmail = req.email.toLowerCase().includes(search.toLowerCase())
        const isProject = req.answers.questions[3].answer?.toLowerCase().includes(search.toLowerCase())
        const isSocial = req.answers.questions[5].answer?.toLowerCase().includes(search.toLowerCase())
        const isAPI = req.id.toLowerCase().includes(search.toLowerCase())
        if (isName || isEmail || isProject || isSocial || isAPI) {
            return req
        }
        return false
    })
}
