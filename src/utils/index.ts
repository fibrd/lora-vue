import moment from 'moment'
import 'moment/locale/cs'
moment.locale('cs')

export const formatDate = (date: Date): string => {
    const formatted = moment(date).fromNow()
    return formatted
}
