function dbPasswordCommand(password){
    if (Cypress.platform === 'win32'){
        return `set PGPASSWORD=${password}&& `
    }
    else{
        return `PGPASSWORD=${password} `
    }
}

function dbCommand(command){
    return cy.exec(
        dbPasswordCommand(Cypress.env('psql_db_password')) +
        `psql -d ${Cypress.env('psql_db_name')} ` +
        `-U ${Cypress.env('psql_db_username')} ` +
        `-h ${Cypress.env('psql_db_host')} ` +
        `-p ${Cypress.env('psql_db_port')} ` +
        `-c "${command.replace(/\r?\n/g, " ")}"`
    );
}

Cypress.Commands.add('beforeEachTournament', () => {
    dbCommand(`
        INSERT INTO assessments (id, sequence, status, title, course_execution_id) VALUES (1, 0, 'AVAILABLE', 'test1', 1);
        INSERT INTO assessments (id, sequence, status, title, course_execution_id) VALUES (2, 0, 'AVAILABLE', 'test2', 1);
        INSERT INTO topic_conjunctions (id, assessment_id) VALUES (100, 1);
        INSERT INTO topic_conjunctions (id, assessment_id) VALUES (101, 2);
        INSERT INTO topics (id, name, course_id) VALUES (82, 'Software Architecture', 1);
        INSERT INTO topics (id, name, course_id) VALUES (83, 'Web Application', 1);
        INSERT INTO topics_topic_conjunctions (topics_id, topic_conjunctions_id) VALUES (82, 100);
        INSERT INTO topics_topic_conjunctions (topics_id, topic_conjunctions_id) VALUES (83, 101);
        INSERT INTO questions (id, title, content, status, course_id, creation_date) VALUES (1389, 'test', 'Question?', 'AVAILABLE', 1, current_timestamp);
        INSERT INTO topics_questions (topics_id, questions_id) VALUES (82, 1389);
    `)
});

Cypress.Commands.add('cleanTestTopics', () => {
    dbCommand(`
        DELETE FROM topics
        WHERE name like 'CY%'
    `)
});

Cypress.Commands.add('updateTournamentStartTime', () => {
    dbCommand(`
        UPDATE tournaments SET start_time = '2020-07-16 07:57:00';
    `)
});

Cypress.Commands.add('afterEachTournament', () => {
    dbCommand(`
        DELETE FROM tournaments_topics WHERE topics_id = 82;
        DELETE FROM tournaments_topics WHERE topics_id = 83;
        DELETE FROM topics_topic_conjunctions WHERE topics_id = 82;
        DELETE FROM topics_topic_conjunctions WHERE topics_id = 83;
        DELETE FROM topic_conjunctions WHERE id = 100;
        DELETE FROM topic_conjunctions WHERE id = 101;
        DELETE FROM assessments WHERE id = 1;
        DELETE FROM assessments WHERE id = 2;
        DELETE FROM topics_questions WHERE questions_id = 1389;
        DELETE FROM topics WHERE id = 82;
        DELETE FROM topics WHERE id = 83;
        DELETE FROM question_answers WHERE quiz_question_id = 1;
        DELETE FROM question_answers WHERE quiz_question_id = 2;
        DELETE FROM quiz_questions WHERE question_id = 1389;
        DELETE FROM questions WHERE id = 1389;
        DELETE FROM tournaments_participants;
        DELETE FROM tournaments; 
        ALTER SEQUENCE tournaments_id_seq RESTART WITH 1;
        UPDATE tournaments SET id=nextval('tournaments_id_seq');
    `)
});