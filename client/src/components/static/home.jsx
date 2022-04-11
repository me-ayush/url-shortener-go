import React from 'react'
import Header from '../navbar'
import './home.scss'

const Home = () => {
  return (
    <>
      <Header />

      <section id='home'>

        <div class="banner">
          <div class="container">
            <div class="row">
              <div class="col-md-8 mt-5 pt-5 offset-md-2">
                <div class="header-text caption text-center">
                  <h2 >Add Your URL Now</h2>
                </div>
                <form method='POST' id='suggestion_form' onSubmit={(e) => handleAdd(e)} autoComplete="false">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group first">
                        <div className="form-floating mb-3">
                          <input type="text" className="form-control " id="url" placeholder="Enter URL" onChange={(e) => { setUrl(e.target.value) }} />
                          <label htmlFor="url">Enter URL</label>
                        </div>
                      </div>
                    </div>
                    <div className="col">

                      <div className="row">
                        <div className="col">
                          <div className="form-group last mb-4">
                            <div className="form-floating mb-3">
                              <input type="text" className="form-control" id="custom" placeholder="Custom Short (Optional)" onChange={(e) => { setCustom(e.target.value) }} />
                              <label htmlFor="custom">Custom Short (Optional)</label>
                            </div>
                          </div>
                        </div>

                        <div className="col">
                          <button className='btn btn-success mb-3 p-3 w-100'>Add This URL</button>
                        </div>
                      </div>

                    </div>


                  </div>

                </form>


                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default Home