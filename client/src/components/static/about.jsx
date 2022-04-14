import React from 'react'
import Header from '../navbar'
import './about.scss'


const About = () => {
  return (
    <>
      <Header />
      <div id='about'>

      <section className="section_all bg-light" id="about">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section_title_all text-center">
                            <h3 className="font-weight-bold">Welcome To <span className="text-custom">Lorem Ipsum</span></h3>
                            <p className="section_subtitle mx-auto text-muted">Lorem Ipsum is simply dummy text of the printing and typesetting industry. <br/>Lorem Ipsum has been the industry's standard dummy text.</p>
                            <div className="">
                                <i className=""></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row vertical_content_manage mt-5">
                    <div className="col-lg-6">
                        <div className="about_header_main mt-3">
                            <div className="about_icon_box">
                                <p className="text_custom font-weight-bold">Lorem Ipsum is simply dummy text</p>
                            </div>
                            <h4 className="about_heading text-capitalize font-weight-bold mt-4">Lorem Ipsum is simply dummy text of the printing industry.</h4>
                            <p className="text-muted mt-3">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</p>

                            <p className="text-muted mt-3"> Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage.</p>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="img_about mt-3">
                            <img src="https://i.ibb.co/qpz1hvM/About-us.jpg" alt="" className="img-fluid mx-auto d-block"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>
    </>
  )
}

export default About