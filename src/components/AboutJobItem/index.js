import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'Failure',
}

class AboutJobItem extends Component {
  state = {
    jobDetails: [],
    similarJobData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async props => {
    const {match} = props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_Token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      header: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobData = [data.job_details].map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        companyWebsiteUrl: eachJob.company_website_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        lifeAtCompany: {
          description: eachJob.description,
          imageUrl: eachJob.image_url,
        },
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        skills: eachJob.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: eachJob.title,
      }))

      const updatedSimilarJobData = data.similar_jobs.map(eachSimilarJobs => ({
        companyLogoUrl: eachSimilarJobs.company_logo_url,
        employmentType: eachSimilarJobs.employment_type,
        id: eachSimilarJobs.id,
        jobDescription: eachSimilarJobs.job_description,
        location: eachSimilarJobs.location,
        rating: eachSimilarJobs.rating,
        title: eachSimilarJobs.title,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        jobDetails: updatedJobData,
        similarJobData: updatedSimilarJobData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jobDetails, similarJobData} = this.state
    if (jobDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        skills,
        title,
        rating,
        description,
      } = jobDetails[0]

      return (
        <>
          <div className="job-item-container">
            <div className="first-part-container">
              <div className="image-title-container">
                <img
                  src={companyLogoUrl}
                  alt="job detail company logo"
                  className="company-logo"
                />
              </div>
              <div className="title-rating-container">
                <h1 className="title-heading">{title}</h1>
                <div className="star-rating-container">
                  <AiFillStar className="star-icon" />
                  <p className="rating-text">{rating}</p>
                </div>
              </div>
              <div className="location-package-container">
                <div className="location-job-type-container">
                  <div className="location-icon-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{location}</p>
                  </div>
                  <div className="employee-type-icon-employee-type-container">
                    <p className="job-type">{employmentType}</p>
                  </div>
                </div>
                <div className="package-container">
                  <p className="package-per-annum">{packagePerAnnum}</p>
                </div>
              </div>
            </div>
          </div>
          <hr className="horizontal-line" />
          <div className="second-part-container">
            <div className="description-visit-container">
              <h1 className="description">{description}</h1>
              <a className="visit-anchor" href={companyWebsiteUrl}>
                Visit <BiLinkExternal />
              </a>
            </div>
            <p className="description-para">{jobDescription}</p>
          </div>
          <h1>Skill</h1>
          <ul className="ul-job-detail-container">
            {skills.map(eachItem => (
              <li className="li-job-detail-container" key={eachItem.name}>
                <img
                  src={eachItem.imageUrl}
                  alt={eachItem.name}
                  className="skill-image"
                />
                <p>{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <div className="company-life-img-container">
            <div className="life-heading-para-container">
              <h1>Life at Company</h1>
              <p>{lifeAtCompany.description}</p>
            </div>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-job-ul-container">
            {similarJobData.map(eachSimilarJob => (
              <SimilarJobs
                key={eachSimilarJob.id}
                similarJobData={eachSimilarJob}
                employmentType={employmentType}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  onRetryJobDetailsAgain = () => {
    this.getJobData()
  }

  renderJobFailureView = () => (
    <div className="job-detail-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for.</p>
      <div className="btn-container-failure">
        <button
          className="failure-job-detail-btn"
          type="button"
          onClick={this.onRetryJobDetailsAgain}
        >
          retry
        </button>
      </div>
    </div>
  )

  renderJobLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobLoaderView()
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-view-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default AboutJobItem
