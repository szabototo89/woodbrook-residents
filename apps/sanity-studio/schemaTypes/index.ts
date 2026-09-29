import {collectionDate} from './collectionDate'
import {event} from './event'
import {issueReport} from './issueReport'
import {project} from './project'
import {resource} from './resource'
import {resourceDetail} from './resourceDetail'
import {siteSetting} from './siteSetting'
import {survey} from './survey'
import {update} from './update'

export const schemaTypes = [
  siteSetting,
  update,
  project,
  event,
  survey,
  resource,
  resourceDetail,
  collectionDate,
  issueReport,
]
