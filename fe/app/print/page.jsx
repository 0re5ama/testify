'use client';
import {
    faCheck,
    faEdit,
    faPrint,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { baseURL } from '../api';
import Select from '../components/Select';

export default function () {
    const [subjects, setSubjects] = useState([]);
    const [units, setUnits] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [subjectId, setSubjectId] = useState('');
    const [unitId, setUnitId] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const classId = 10;
    const [table, setTable] = useState(null);
    const [question, setQuestion] = useState('');

    const [prevQuestion, setPrevQuestion] = useState('');

    const fetchQuestions = async () => {
        if (!chapterId) return;
        let res = await axios.get(`${baseURL}/chapter/${chapterId}/questions`);
        setQuestions(res.data.rows);
    };

    const print = async (form) => {
        const data = selectedQuestions.map((x) => x.id);
        try {
            let res = await axios.post(`${baseURL}/question-set/print`, data, {
                responseType: 'blob',
            });
            if (res.status == 200) {
                console.log(res);
                fileDownload(res.data, 'question.pdf');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const removeSelected = (index) => {
        let vals = [...selectedQuestions];
        vals.splice(index, 1);
        setSelectedQuestions(vals);
    };

    const addSelected = (index) => {
        let selected = questions[index];
        if (!selectedQuestions.find((x) => x.id == selected.id))
            setSelectedQuestions([...selectedQuestions, selected]);
    };

    useEffect(() => {
        const fetchSubjects = async () => {
            let res = await axios.get(`${baseURL}/subject`);
            setSubjects(res.data.rows);
        };
        if (chapterId) fetchQuestions();
        fetchSubjects();
        let prev = JSON.parse(localStorage.getItem('question'));
        if (prev && prev.subjectId) setSubjectId(prev.subjectId);
    }, []);

    const changeSubject = async (id) => {
        if (!id) setUnits([]);
        else {
            let res = await axios.get(`${baseURL}/subject/${id}/units`);
            setUnits(res.data.rows);
            let prev = JSON.parse(localStorage.getItem('question'));
            if (prev && prev.unitId) setUnitId(prev.unitId);
        }
    };

    const changeUnit = async (id) => {
        if (!id) setChapters([]);
        else {
            let res = await axios.get(`${baseURL}/unit/${id}/chapters`);
            setChapters(res.data.rows);
            let prev = JSON.parse(localStorage.getItem('question'));
            if (prev && prev.chapterId) setChapterId(prev.chapterId);
        }
    };

    const changeChapter = async (id) => {
        if (id) await fetchQuestions();
    };

    return (
        <MathJaxContext>
            <main className="flex min-h-screen flex-col justify-start">
                <ToastContainer />
                <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                    <h2>Question</h2>
                </div>
                <div className="row">
                    <form
                        className="col"
                        onSubmit={(evt) => {
                            evt.preventDefault();
                            print(evt.target);
                        }}
                    >
                        <label>
                            Class:{' '}
                            <input
                                type="text"
                                readOnly
                                name="class"
                                value={classId}
                            />
                        </label>
                        <div className="row mb-5">
                            <label className="col">
                                Subject:
                                <Select
                                    onChange={async (val) => {
                                        setSubjectId(val);
                                        await changeSubject(val);
                                    }}
                                    name="subjectId"
                                    val={subjectId}
                                    options={subjects}
                                    caption
                                />
                            </label>
                            <label className="col">
                                Unit:
                                <Select
                                    onChange={async (val) => {
                                        setUnitId(val);
                                        await changeUnit(val);
                                    }}
                                    name="unitId"
                                    val={unitId}
                                    options={units}
                                    caption
                                />
                            </label>
                            <label className="col">
                                Chapter:
                                <Select
                                    onChange={async (val) => {
                                        setChapterId(val);
                                        await changeChapter(val);
                                    }}
                                    name="chapterId"
                                    val={chapterId}
                                    options={chapters}
                                    caption
                                />
                            </label>
                        </div>
                        <div>
                            <button type="submit">
                                <FontAwesomeIcon icon={faPrint} /> Print
                            </button>
                        </div>
                    </form>
                </div>
                <section className="question-select">
                    <section>
                        <ol className="question-list">
                            {questions &&
                                questions.map((q, i) => (
                                    <li key={i}>
                                        <div className="flex justify-between">
                                            <div>
                                                <MathJax>{q.desc}</MathJax>
                                                <ol>
                                                    {q.subQuestions &&
                                                        q.subQuestions.map(
                                                            (sq, j) => (
                                                                <li key={j}>
                                                                    <MathJax>
                                                                        {
                                                                            sq.desc
                                                                        }
                                                                    </MathJax>
                                                                </li>
                                                            ),
                                                        )}
                                                </ol>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        addSelected(i)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCheck}
                                                    />
                                                </button>
                                                <button>
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ol>
                    </section>
                    <section>
                        <ol className="question-list">
                            {selectedQuestions &&
                                selectedQuestions.map((q, i) => (
                                    <li key={i}>
                                        <div className="flex justify-between">
                                            <div>
                                                <MathJax>{q.desc}</MathJax>
                                                <ol>
                                                    {q.subQuestions &&
                                                        q.subQuestions.map(
                                                            (sq, j) => (
                                                                <li key={j}>
                                                                    <MathJax>
                                                                        {
                                                                            sq.desc
                                                                        }
                                                                    </MathJax>
                                                                </li>
                                                            ),
                                                        )}
                                                </ol>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        removeSelected(i)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ol>
                    </section>
                </section>
            </main>
        </MathJaxContext>
    );
}
