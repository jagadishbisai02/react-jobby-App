import {Component} from 'react'
import Loader from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const apiJobStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkboxInputs: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiJobStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobData()
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrlProfile = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      header: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(apiUrlProfile, optionsProfile)
    if (response.ok === true) {
      const dataProfile = [await response.json()]
      const updatedProfileData = dataProfile.profile_details.map(eachItem => ({
        name: eachItem.name,
        profileImageUrl: eachItem.profile_image_url,
        shortBio: eachItem.short_bio,
      }))
      this.setState({
        profileData: updatedProfileData,
        responseSuccess: true,
        apiStatus: apiStatusConstants.failure,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobData = async () => {
    this.setState({apiJobStatus: apiJobStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_Token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const apiJobUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      header: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobs = await fetch(apiJobUrl, options)
    if (responseJobs.ok === true) {
      const jobData = await responseJobs.json()
      const updatedJob = jobData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        packagePerAnnum: eachJob.package_per_annum,
        title: eachJob.title,
        rating: eachJob.rating,
        id: eachJob.id,
      }))
      this.setState({
        jobsData: updatedJob,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({
        apiJobStatus: apiJobStatusConstants.failure,
      })
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.value}, this.getJobData)
  }

  onGetInputOption = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.getJobData,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({checkboxInputs: filteredData}, this.getJobData)
    }
  }

  renderProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData
      return (
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" className="profile-icon" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.getProfile()
  }

  renderProfileFailure = () => (
    <div className="failure-container">
      <button type="button" className="retry-btn" onClick={this.onRetryProfile}>
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  onRetryJobData = () => {
    this.getJobData()
  }

  renderJobDataFailure = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went to Wrong</h1>
      <p className="failure-paragraph">
        We cannot seem to find the page your looking for
      </p>
      <div className="failure-retry-btn">
        <button
          type="button"
          className="retry-btn"
          onClick={this.onRetryProfile}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1>No jobs found</h1>
        <p>We could not fond any jobs. Try other filter.</p>
      </div>
    ) : (
      <ul className="ul-job-item-container">
        {jobsData.map(eachJob => (
          <JobItem jobDetails={eachJob} key={eachJob.id} />
        ))}
      </ul>
    )
  }

  renderJobStatus = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiJobStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiJobStatusConstants.success:
        return this.renderJobView()
      case apiJobStatusConstants.failure:
        return this.renderJobDataFailure()
      default:
        return null
    }
  }

  onGetCheckboxView = () => (
    <ul className="checkbox-container">
      {employmentTypesList.map(eachItem => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            id={eachItem.salaryRangeId}
            className="input"
            type="radio"
            onChange={this.onGetInputOption}
          />
          <label className="label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetRadioView = () => (
    <ul className="radio-container">
      {salaryRangesList.map(eachItem => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            id={eachItem.salaryRangeId}
            className="radio"
            type="radio"
            name="option"
            onChange={this.onGetRadioOption}
          />
          <label className="label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobData()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="all-job-container">
          <div className="side-bar-container">
            {this.renderProfileStatus()}
            <hr className="hr-line" />
            <h1 className="text">Type of Employment</h1>
            {this.onGetCheckboxView()}
            <hr className="hr-line" />
            <h1 className="text">Salary Range</h1>
            {this.onGetRadioOption()}
          </div>
          <div className="Job-container">
            <div>
              <input
                type="search"
                className="search-input"
                value={searchInput}
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                className="search-btn"
                type="button"
                onClick={this.onSubmitSearchInput}
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
