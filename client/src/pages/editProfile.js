import React from 'react';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import "../assets/css/editprofile.css"
import PersonalDetailsForm from '../components/personalDetails';
import EducationForm from '../components/education';
import ExperienceForm from '../components/experience';
import TechSkillsForm from "../components/technicalSkills"
import HobbiesForm from "../components/hobbies"
import SoftSkillsForm from '../components/softSkills';
import HardSkillsForm from '../components/hardSkills';
import { getProfile, updateProfile, createProfile } from "../data/data"
import "../assets/css/sidebar.css"



class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            formData: {
                name: "",
                profileImage: "https://365psd.com/images/istock/previews/1009/100996291-male-avatar-profile-picture-vector.jpg",
                title: "",
                designation: "",
                youtubeProfile: "",
                githubProfile: "",
                specialization: "",
                education: [],
                experience: [],
                technicalSkills: [],
                hobbies: [],
                softSkills: [],
                hardSkills: [],
                createdBy:props.userName
            },
            isCreated: props.isCreated,
            isEditable: props.isEditable
        }
        this.personalDetailChange = this.personalDetailChange.bind(this);

        this.educationChage = this.educationChage.bind(this);
        this.educationRemoved = this.educationRemoved.bind(this);
        this.educationAdded = this.educationAdded.bind(this);

        this.experienceChage = this.experienceChage.bind(this);
        this.experienceRemoved = this.experienceRemoved.bind(this);
        this.experienceAdded = this.experienceAdded.bind(this);
        this.experienceDateChange = this.experienceDateChange.bind(this);

        this.skillsHobbiesChanged = this.skillsHobbiesChanged.bind(this);
        this.skillsHobbiesRemoved = this.skillsHobbiesRemoved.bind(this);
        this.skillsHobbiesAdded = this.skillsHobbiesAdded.bind(this);

        this.softSkillsChange = this.softSkillsChange.bind(this);
        this.softSkillAdded = this.softSkillAdded.bind(this);
        this.softSkillRemoved = this.softSkillRemoved.bind(this);

        this.hardSkillAdded = this.hardSkillAdded.bind(this);
        this.hardSkillChange = this.hardSkillChange.bind(this);
        this.hardSkillRemoved = this.hardSkillRemoved.bind(this);
        this.hardSkillSubSkillAdded = this.hardSkillSubSkillAdded.bind(this);
        this.hardSkillSubSkillChange = this.hardSkillSubSkillChange.bind(this);
        this.hardSkillSubSKillRemoved = this.hardSkillSubSKillRemoved.bind(this);

        this.updateProfile = this.updateProfile.bind(this);
        this.calculateRating = this.calculateRating.bind(this);
    }



    componentDidMount() {
        if (this.state.isCreated) {
            this.props.toggleLoading()
            getProfile(this.props.match.params.id).then((doc) => {
                // alert(JSON.stringify(doc));
                this.setState({ formData: doc })

            }).catch((err) => {

            }).finally(() => {
                this.props.toggleLoading()

            });



        }
    }
    updateProfile() {
        this.props.toggleLoading("updating profile")
        if (this.state.isCreated) {
            updateProfile(this.state.formData).then((doc) => {
                NotificationManager.success("Profile Updates")
            }).catch((err) => {
                NotificationManager.error("Error Connecting..")
                

            }).finally(() => {
                this.props.toggleLoading()

            });

        }
        else {
            createProfile(this.state.formData).then((doc) => {
                var formData = this.state.formData;
                formData._id = doc._id;
                this.setState({ formData });
                this.setState({ isCreated: true });
                NotificationManager.success("Profile Created")
            }).catch((err) => {
                NotificationManager.error("Error Connecting..")


            }).finally(() => {
                this.props.toggleLoading()

            });

        }
    }

    personalDetailChange(type, event) {
        var formData = this.state.formData;
        formData[type] = event.target.value;
        this.setState({ formData });
    }
    educationChage(index, type, event) {
        var formData = this.state.formData;
        formData.education[index][type] = event.target.value;
        this.setState({ formData });

    }
    educationRemoved(index) {
        this.setState(this.state.formData.education.splice(index, 1));
    }
    educationAdded() {
        var formData = this.state.formData;
        formData.education.push(
            {
                university: "",
                branch: "",
                comment: ""
            }
        )
        this.setState({ formData })
    }
    experienceChage(index, type, event) {
        var formData = this.state.formData;
        formData.experience[index][type] = event.target.value;
        this.setState({ formData });

    }
    experienceDateChange(index, type, date) {
        var formData = this.state.formData;
        formData.experience[index][type] = date;
        this.setState({ formData });

    }
    experienceRemoved(index) {
        this.setState(this.state.formData.experience.splice(index, 1));

    }
    experienceAdded() {
        var formData = this.state.formData;
        formData.experience.push(
            {
                company: "",
                position: "",
                startDate: new Date(),
                endDate: new Date(),
                isPresent: false,
                desc: ""
            }
        )
        this.setState({ formData })


    }
    skillsHobbiesChanged(index, type, event) {
        var formData = this.state.formData;
        formData[type][index] = event.target.value;
        this.setState({ formData });


    }
    skillsHobbiesRemoved(index, type) {
        this.setState(this.state.formData[type].splice(index, 1));

    }
    skillsHobbiesAdded(type) {
        var formData = this.state.formData;
        formData[type].push("");
        this.setState({ formData });

    }
    softSkillsChange(index, type, event) {
        var formData = this.state.formData;
        formData.softSkills[index][type] = event.target.value;
        this.setState({ formData });


    }
    softSkillRemoved(index) {
        this.setState(this.state.formData.softSkills.splice(index, 1));

    }
    softSkillAdded() {
        var formData = this.state.formData;
        formData.softSkills.push(
            {
                name: "",
                rating: 1,
                comment: ""
            }

        )
        this.setState({ formData });


    }
    hardSkillAdded() {
        var formData = this.state.formData;
        formData.hardSkills.push(
            {
                name: "",
                subSkills: []
            }
        )
        this.setState({ formData });

    }
    hardSkillChange(index, event) {
        var formData = this.state.formData;
        formData.hardSkills[index].name = event.target.value;
        this.setState({ formData });

    }
    hardSkillRemoved(index) {
        this.setState(this.state.formData.hardSkills.splice(index, 1));

    }
    hardSkillSubSkillAdded(index) {
        var formData = this.state.formData;
        formData.hardSkills[index].subSkills.push(
            {
                name: "",
                experience: 1,
                rating: 1,

            }

        )
        this.setState({ formData });

    }
    hardSkillSubSkillChange(index1, index2, type, event) {
        var formData = this.state.formData;
        formData.hardSkills[index1].subSkills[index2][type] = event.target.value;
        this.setState({ formData });

    }
    hardSkillSubSKillRemoved(index1, index2) {
        var formData = this.state.formData;
        formData.hardSkills[index1].subSkills.splice(index2, 1);
        this.setState({ formData });

    }

    calculateRating() {
        var rating = 0;
        var total = 0;
        this.state.formData.hardSkills.forEach((hardSkill) => {
            hardSkill.subSkills.forEach((skill) => {
                rating += skill.rating;
                total+=5;
            })
        })
        this.state.formData.softSkills.forEach((softSkill) => {
            rating += softSkill.rating;
            total+=5;
        })
        return !total ? 0 : ((rating / total)*5);
    }


    render() {
        return (
            <div>

                <div class="container py-5 my-5 ">
                    {this.state.isEditable
                        ? <div class=" ">
                            <h2 class="heading font-weight-bold">{this.state.isCreated ? "EDIT" : "CREATE"} PROFILE</h2>
                            <button onClick={this.updateProfile} class="float-right btn create-button btn-success">Save</button>
                            <p class="lead text-muted" >{this.state.isCreated ? "EDIT" : "Create"}  developer profile </p>
                        </div>
                        :
                        <div></div>}

                    <PersonalDetailsForm
                        formData={this.state.formData}
                        personalDetailChange={this.personalDetailChange}
                        isEditable = {this.state.isEditable}
                        rating = {this.calculateRating}
                        
                        />
                    <EducationForm
                        formData={this.state.formData}
                        educationAdded={this.educationAdded}
                        educationChage={this.educationChage}
                        educationRemoved={this.educationRemoved}
                        isEditable = {this.state.isEditable}
                    />
                    <ExperienceForm
                        formData={this.state.formData}
                        experienceAdded={this.experienceAdded}
                        experienceChage={this.experienceChage}
                        experienceRemoved={this.experienceRemoved}
                        experienceDateChange={this.experienceDateChange}
                        isEditable = {this.state.isEditable}
                    />

                    <TechSkillsForm
                        formData={this.state.formData}
                        skillsHobbiesAdded={this.skillsHobbiesAdded}
                        skillsHobbiesChanged={this.skillsHobbiesChanged}
                        skillsHobbiesRemoved={this.skillsHobbiesRemoved}
                        isEditable = {this.state.isEditable}

                    />
                    <HobbiesForm
                        formData={this.state.formData}
                        skillsHobbiesAdded={this.skillsHobbiesAdded}
                        skillsHobbiesChanged={this.skillsHobbiesChanged}
                        skillsHobbiesRemoved={this.skillsHobbiesRemoved}
                        isEditable = {this.state.isEditable}
                    />
                    < SoftSkillsForm
                        formData={this.state.formData}
                        softSkillAdded={this.softSkillAdded}
                        softSkillRemoved={this.softSkillRemoved}
                        softSkillsChange={this.softSkillsChange}
                        isEditable = {this.state.isEditable}
                    />
                    <HardSkillsForm
                        formData={this.state.formData}
                        hardSkillAdded={this.hardSkillAdded}
                        hardSkillChange={this.hardSkillChange}
                        hardSkillRemoved={this.hardSkillRemoved}
                        hardSkillSubSkillAdded={this.hardSkillSubSkillAdded}
                        hardSkillSubSkillChange={this.hardSkillSubSkillChange}
                        hardSkillSubSKillRemoved={this.hardSkillSubSKillRemoved}
                        isEditable = {this.state.isEditable}
                    />
                </div>
                <NotificationContainer />
            </div>
        );
    }
}
export default EditProfile;