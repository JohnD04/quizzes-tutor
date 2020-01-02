package pt.ulisboa.tecnico.socialsoftware.tutor.course;

import pt.ulisboa.tecnico.socialsoftware.tutor.exceptions.TutorException;
import pt.ulisboa.tecnico.socialsoftware.tutor.question.domain.Assessment;
import pt.ulisboa.tecnico.socialsoftware.tutor.quiz.domain.Quiz;
import pt.ulisboa.tecnico.socialsoftware.tutor.user.User;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

import static pt.ulisboa.tecnico.socialsoftware.tutor.exceptions.ExceptionError.COURSE_EXECUTION_ACADEMIC_TERM_IS_EMPTY;
import static pt.ulisboa.tecnico.socialsoftware.tutor.exceptions.ExceptionError.COURSE_EXECUTION_ACRONYM_IS_EMPTY;

@Entity
@Table(name = "course_executions")
public class CourseExecution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String acronym;
    private String academicTerm;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToMany(mappedBy = "courseExecutions")
    private Set<User> users;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "courseExecution", fetch=FetchType.LAZY)
    private Set<Quiz> quizzes = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "courseExecution", fetch=FetchType.LAZY)
    private Set<Assessment> assessments = new HashSet<>();

    public CourseExecution() {
    }

    public CourseExecution(Course course, String acronym, String academicTerm) {
        if (acronym.trim().isEmpty()) {
            throw new TutorException(COURSE_EXECUTION_ACRONYM_IS_EMPTY);
        }
        if (academicTerm.trim().isEmpty()) {
            throw new TutorException(COURSE_EXECUTION_ACADEMIC_TERM_IS_EMPTY);
        }

        this.course = course;
        this.acronym = acronym;
        this.academicTerm = academicTerm;
        course.addCourseExecution(this);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public String getAcademicTerm() {
        return academicTerm;
    }

    public void setAcademicTerm(String academicTerm) {
        this.academicTerm = academicTerm;
    }

    public Set<Quiz> getQuizzes() {
        return quizzes;
    }

    public void setQuizzes(Set<Quiz> quizzes) {
        this.quizzes = quizzes;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}