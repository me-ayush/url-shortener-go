import React from 'react'

const ProfileSettings = () => {

  const handleChangePass = (e) =>{
    e.preventDefault()
  }

  const handleDeactivate = (e) =>{
    e.preventDefault()
  }

  const handleDelete = (e) =>{
    e.preventDefault()
  }

  return (
    <div>
      <div className="accordion ms-3">

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#changePass">
              Change Password
            </button>
          </h2>
          <div id="changePass" className="accordion-collapse collapse">
            <div className="accordion-body">

              <form  autoComplete="off" onSubmit={handleChangePass}>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control shadow-none" id="floatingPassword1" placeholder="Password" required />
                  <label htmlFor="floatingPassword1">Old Password</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control shadow-none" id="floatingPassword2" placeholder="Password" required />
                  <label htmlFor="floatingPassword2">New Password</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="password" className="form-control shadow-none" id="floatingPassword3" placeholder="Password" required />
                  <label htmlFor="floatingPassword3">Confirm Password</label>
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

              <form onSubmit={handleDeactivate}>
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

              <form onSubmit={handleDelete}>
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