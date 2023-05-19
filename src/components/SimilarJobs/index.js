import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const SimilarJobs = props => {
  const {similarJobData} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobData

  return (
    <li className="similar-job-li-container">
      <div className="img-job-title-container">
        <img
          src={companyLogoUrl}
          className="company-logo"
          alt="similar job company logo"
        />
        <div className="title-job-rating-container">
          <h1 className="title-job-heading">{title}</h1>
          <div className="star-job-rating-container">
            <AiFillStar className="star-icon" />
            <p className="rating-job-text">{rating}</p>
          </div>
        </div>
      </div>
      <div className="second-part-job-container">
        <h1 className="description-heading">Description</h1>
        <p className="description">{jobDescription}</p>
      </div>
      <div className="location-type-detail-container">
        <div className="location-container">
          <MdLocationOn className="location-icon" />
          <p className="location">{location}</p>
        </div>
        <div className="job-employment-type-container">
          <p className="employment-type">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobs
