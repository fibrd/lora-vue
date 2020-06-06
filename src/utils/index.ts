import moment from 'moment'
import 'moment/locale/cs'
moment.locale('cs')

export const formatDate = (date: Date): string => {
    const formatted = moment(date).fromNow()
    return formatted
}

export const formatName = (name: string): string => {
    return name
        .toString()
        .replace(
            /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g,
            '' // replacing emojis
        )
        .trim()
}
