import React from 'react'

const ProfileSettings = () => {
  return (
    <div>
      <div className="accordion">

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#changePass">
              Change Password
            </button>
          </h2>
          <div id="changePass" className="accordion-collapse collapse">
            <div className="accordion-body">

              <form  autoComplete="off">
                <div className="form-floating mb-3">
                  <input type="password" className="form-control shadow-none" id="floatingPassword" placeholder="Password" required />
                  <label htmlFor="floatingPassword">Old Password</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control shadow-none" id="floatingPassword" placeholder="Password" required />
                  <label htmlFor="floatingPassword">New Password</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control shadow-none" id="floatingPassword" placeholder="Password" required />
                  <label htmlFor="floatingPassword">Confirm Password</label>
                </div>

                <button className='btn btn-success' style={{ width: "200px" }}>Update Password</button>

              </form>

            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#deactivateAccount">
              Deactivate Account
            </button>
          </h2>
          <div id="deactivateAccount" className="accordion-collapse collapse">
            <div className="accordion-body">

              <form>
                <div className="row">
                  <div className="col-12 mb-2">
                    <input type="checkbox" name="" id="check-deactivate" required />
                    <label htmlFor="check-deactivate" className='mx-2'>I Confirm to Deactivate My Account.</label>
                  </div>
                  <div className="col-12">
                    <button className='btn btn-danger ms-4' style={{ width: "200px" }}>Deactivate Account</button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#deleteAccount">
              Delete Account
            </button>
          </h2>
          <div id="deleteAccount" className="accordion-collapse collapse">
            <div className="accordion-body">

              <form>
                <div className="row">
                  <div className="col-12 mb-2">
                    <input type="checkbox" name="" id="check-delete" required />
                    <label htmlFor="check-delete" className='mx-2'>I Confirm to Delete My Account.</label>
                  </div>
                  <div className="col-12">
                    <button className='btn btn-danger ms-4' style={{ width: "200px" }}>Delete Account</button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProfileSettings