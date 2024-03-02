import {
    faAdd,
    faBan,
    faImage,
    faSave,
    faSitemap,
    faTable,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { MathJax } from 'better-react-mathjax';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { baseURL } from '../api';
import Select from '../components/Select';

const QuestionForm = ({
    fetchQuestions,
    duplicater,
    currQuestion,
    mode,
    setMode,
}) => {
    const [subjectId, setSubjectId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [units, setUnits] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [unitId, setUnitId] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [question, setQuestion] = useState('');
    const [subQuestions, setSubQuestions] = useState([]);
    const [dgms, setDgms] = useState([]);
    const classId = 10;
    const ref = useRef();

    const addTable = () => {
        setTable([]);
    };

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

    const addSubQuestion = () => {
        setSubQuestions([...subQuestions, { id: null, desc: '' }]);
    };

    const addDgm = () => {
        setDgms([...dgms, { id: null, desc: '' }]);
    };

    const changeSubQuestion = (evt, index) => {
        let vals = [...subQuestions];
        vals[index].desc = evt.target.value;
        setSubQuestions(vals);
    };

    const changeDgm = (evt, index) => {
        let vals = [...dgms];
        vals[index].desc = evt.target.value;
        setDgms(vals);
    };

    const delSubQuestion = (index) => {
        let vals = [...subQuestions];
        vals.splice(index, 1);
        setSubQuestions(vals);
    };

    const delDgm = (index) => {
        let vals = [...dgms];
        vals.splice(index, 1);
        setDgms(vals);
    };

    const save = async (form) => {
        const formData = new FormData(form);
        const data = {
            class: +formData.get('class'),
            chapterId: +formData.get('chapterId'),
            desc: formData.get('desc'),
        };
        const store = {
            ...data,
            subjectId: +formData.get('subjectId'),
            unitId: +formData.get('unitId'),
        };

        localStorage.setItem('question', JSON.stringify(store));
        data.subQuestions = subQuestions;
        data.diagrams = dgms;
        try {
            let res;
            if (mode == 'edit') {
                res = await axios.put(
                    `${baseURL}/question/${currQuestion.id}`,
                    data,
                );
            } else {
                data.subQuestions.forEach((x) => {
                    delete x.id;
                });
                data.diagrams.forEach((x) => {
                    delete x.id;
                });
                res = await axios.post(`${baseURL}/question`, data);
            }
            if (res.status == 201) {
                toast('Successfully saved');
                setQuestion('');
                setSubQuestions([]);
                setDgms([]);
                fetchQuestions(chapterId);
                setMode('add');
                ref.current.focus();
            }
        } catch (err) {
            toast(err);
        }
    };

    useEffect(() => {
        const fetchSubjects = async () => {
            let res = await axios.get(`${baseURL}/subject`);
            setSubjects(res.data.rows);
        };
        fetchSubjects();
        if (chapterId) fetchQuestions(chapterId);
        let prev = JSON.parse(localStorage.getItem('question'));
        if (prev && prev.subjectId) setSubjectId(prev.subjectId);
    }, []);

    useEffect(() => {
        setQuestion(currQuestion?.desc || '');
        setSubQuestions(currQuestion?.subQuestions || []);
        setDgms(currQuestion?.diagrams || []);
    }, [currQuestion]);

    const keyHandler = (evt) => {
        if (evt.key == 'Enter' && evt.shiftKey) {
            evt.preventDefault();
            addSubQuestion();
        } else if (evt.key == 'g' && evt.ctrlKey) {
            evt.preventDefault();
            addDgm();
        } else if (evt.key == 'd' && evt.ctrlKey) {
            evt.preventDefault();
            duplicater();
            setTimeout(() => ref.current.focus(), 500);
        } else if (evt.key == 'Enter' && evt.ctrlKey) {
            evt.preventDefault();
            save(evt.target.form);
        }
    };

    return (
        <>
            <form
                className="col"
                onSubmit={(evt) => {
                    evt.preventDefault();
                    save(evt.target);
                }}
            >
                <label>
                    Class:{' '}
                    <input type="text" readOnly name="class" value={classId} />
                </label>
                <div className="row">
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
                                await fetchQuestions(val);
                            }}
                            name="chapterId"
                            val={chapterId}
                            options={chapters}
                            caption
                        />
                    </label>
                </div>
                <label>
                    Question:
                    <textarea
                        autoFocus={true}
                        ref={ref}
                        className="w-full"
                        name="desc"
                        value={question}
                        onChange={(evt) => {
                            setQuestion(evt.target.value);
                        }}
                        onKeyDown={keyHandler}
                    ></textarea>
                </label>
                {subQuestions &&
                    subQuestions.map((sq, i) => (
                        <div className="sub-question" key={i}>
                            <div>{'abcdefghijk'[i]}</div>
                            <textarea
                                autoFocus={true}
                                className="w-full"
                                onChange={(evt) => changeSubQuestion(evt, i)}
                                value={sq.desc}
                                onKeyDown={keyHandler}
                            ></textarea>
                            <button
                                type="button"
                                onClick={() => delSubQuestion(i)}
                            >
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                        </div>
                    ))}

                {dgms &&
                    dgms.map((sq, i) => (
                        <div className="diagram" key={i}>
                            <FontAwesomeIcon icon={faImage} />
                            <textarea
                                autoFocus={true}
                                className="w-full"
                                onChange={(evt) => changeDgm(evt, i)}
                                value={sq.desc}
                                onKeyDown={keyHandler}
                            ></textarea>
                            <button type="button" onClick={() => delDgm(i)}>
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                        </div>
                    ))}
                <button onClick={addSubQuestion} type="button">
                    <FontAwesomeIcon icon={faAdd} />
                    <FontAwesomeIcon icon={faSitemap} />
                </button>
                <button onClick={addTable} type="button">
                    <FontAwesomeIcon icon={faAdd} />
                    <FontAwesomeIcon icon={faTable} />
                </button>
                <button onClick={addDgm} type="button">
                    <FontAwesomeIcon icon={faAdd} />
                    <FontAwesomeIcon icon={faImage} />
                </button>
                <div>
                    <button type="submit">
                        <FontAwesomeIcon icon={faSave} /> Save
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setQuestion('');
                            setMode('add');
                            setSubQuestions([]);
                        }}
                    >
                        <FontAwesomeIcon icon={faBan} /> Cancel
                    </button>
                </div>
            </form>
            <div className="col">
                <MathJax>{question}</MathJax>
                <ol className="subquestion-list">
                    {subQuestions &&
                        subQuestions.map((sq, j) => (
                            <li key={j}>
                                <MathJax>{sq.desc}</MathJax>
                            </li>
                        ))}
                </ol>
            </div>
        </>
    );
};

export default QuestionForm;
