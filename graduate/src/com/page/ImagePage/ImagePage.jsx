import React, { useState } from "react";
import styled from "styled-components";
import { useRef } from "react";

import "../Page.css";
import HighlightedText from "../../highlight/HightLighted";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { Oval } from "react-loader-spinner";
import { TextInput, Button, FAB } from "react-native-paper";

//   border: 1px solid rgb(212, 210, 224);
const Div_txt = styled.div`
    width: 30%;
    height: 100%;
    float: left;
`;
const Div_txtShow = styled.div`
    width: 68%;
    height: 34%;
    float: left;

    margin: 0px 4px;
`;

const Div_NB = styled.div`
    width: 34%;
    height: 65%;
    float: left;

    margin: 20px 4px 0px 0px;
    isplay: flex;
    flex-direction: column;
`;

const Div_SVM = styled.div`
    width: 34%;
    height: 65%;
    float: left;

    margin: 20px 4px 0px 0px;
`;

export default function ImagePage(props) {
    const [conversionResult, setConversionResult] = useState('');
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imgFile, setImgFile] = useState("");
    const imgRef = useRef();
    const [NBgraph, setNBGraph] = useState({ category: [], value: [] });
    const [SVMgraph, setSVMGraph] = useState({ category: [], value: [] });
    const [NBResult, setNBResult] = useState('');
    const [SVMResult, setSVMResult] = useState('');
    const [selectedResultType, setSelectedResultType] = useState("NB");
    const [loading, setLoading] = useState(false);

    const saveImgFile = (event) => {
        setSelectedImageFile(event.target.files[0]);
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgFile(reader.result);
        };
    };

    const convertImage = () => {
        const formData = new FormData();
        formData.append("image", selectedImageFile);
        setLoading(true);
        setNBGraph({ category: [], value: [] });
        setSVMGraph({ category: [], value: [] });
        setConversionResult('');
        fetch("/convert/image", {
            method: "POST",
            body: formData,
        })
            .then((response) => { 
                if (!response.ok) {
                    throw new Error('No String'); // 예상치 못한 오류 응답 처리
                }
                return response.json();
            })
            .then((data) => {
                setConversionResult(data.text);
                setNBResult(data.result1)
                setSVMResult(data.result2)
                setNBGraph(data.vocabs1);
                setSVMGraph(data.vocabs2);

                setLoading(false);
            })
            .catch((error) => {
                // 에러 처리
                console.error('Error:', error);
                setLoading(false);
                if (error instanceof Error && error.message === 'No String') {
                    alert('이미지에서 추출된 텍스트가 없습니다');
                }
            });
    };

    const handleNBResult = () => {
        setSelectedResultType("NB");
    };
    
    const handleSVMResult = () => {
        setSelectedResultType("SVM");
    };

    const NBchartData = {
        labels: NBgraph.category.slice(0, 5),
        datasets: [
            {
                label: "NB : Top 5 Words",
                data: NBgraph.value.slice(0, 5),
                backgroundColor: "#FF5F6D",
                datalabels: {
                    color: "black",
                    backgroundColor: "white",
                    font: { size: 13, weight: "bold" },
                },
            },
        ],
    };
    const SVMchartData = {
        labels: SVMgraph.category.slice(0, 5),
        datasets: [
            {
                label: "SVM : Top 5 Words",
                data: SVMgraph.value.slice(0, 5),
                backgroundColor: "#FFC371",
                datalabels: {
                    color: "black",
                    backgroundColor: "white",
                    font: { size: 13, weight: "bold" },
                },
            },
        ],
    };
    const options = {
        legend: {
            display: true,
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                },
            },
        },
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div
            className="imageContainer"
            style={{
                //alignItems : "center",
                textAlign: "center",
                // justifyContent : "center",
                //display : "flex",
                fontSize: "1vw",
                margin: "0.5vw",
                width: "80vw",
                height: "100%",
            }}
        >
            <Div_txt>
                <div
                    style={{
                        margin: "1vw 1vw 1vw 1vw",
                        height: "10%",
                        width: "90%",
                        // border: "1px solid rgb(212, 210, 224)",
                        textAlign: "center",
                    }}
                >
                    <div class="filebox">
                        <label for="imgfile" style={{ width: "100px", height: "100%" }}>
                            Upload Image
                        </label>
                        <input
                            type="file"
                            id="imgfile"
                            accept="image/*"
                            onChange={saveImgFile}
                            ref={imgRef}
                        />
                    </div>
                </div>
                <div
                    style={{
                        margin: "1vw 1vw 1vw 1vw",
                        padding: "2vw 0vw 1vw 0vw",
                        height: "60%",
                        width: "90%",
                        // border: "1px solid rgb(212, 210, 224)",
                    }}
                >
                    <img
                        src={imgFile}
                        style={{
                            height: "40vh",
                            width: "20vw",
                            // border: "1px solid rgb(212, 210, 224)",
                        }}
                    />
                </div>
                <button className="imageTestBtn" onClick={convertImage}>
                    VERIFY SPAM
                </button>
            </Div_txt>

            <Div_txtShow>
                <div
                    style={{
                        margin: "20px",
                        width: "90%",
                        height: "90%",
                        background: " #f8f8f8",
                        borderRadius: "32px",
                        boxShadow:
                            "-6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <div
                        style={{
                            //padding : "20px",
                            overflow: "scroll",
                            fontSize: "20px",
                            width: "90%",
                            height: "60%",
                            textAlign: "center",
                            lineHeight: "1.8",
                            padding: "2vw",
                        }}
                    >
                        {(selectedResultType === "NB") && (conversionResult) 
                            && (<HighlightedText text={conversionResult} queries={NBgraph.category} 
                                                    probs={NBgraph.value} result={NBResult} />)}
                        {(selectedResultType === "SVM") && (conversionResult) 
                            && (<HighlightedText text={conversionResult} queries={SVMgraph.category} 
                                                    probs={SVMgraph.value} result={SVMResult} />)}
                    </div>
                    <div>
                        <button
                        onClick={handleNBResult}
                        style={{
                            backgroundColor: selectedResultType === "NB" ? "#12c2e9" : "",
                            padding : "5px 10px 5px 10px",
                            margin: "0px 5px 10px 0px",
                            borderRadius: "32px",
                            border : "none",
                            boxShadow: "-6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2)",
                            color: "#6f6cd",
                            cursor: "pointer",
                        }}
                        >
                        NB
                        </button>
                        <button
                        onClick={handleSVMResult}
                        style={{
                            backgroundColor: selectedResultType === "SVM" ? "#c471ed" : "",
                            padding : "5px 10px 5px 10px",
                            margin: "0px 0px 10px 5px",
                            borderRadius: "32px",
                            border : "none",
                            boxShadow: "-6px -6px 10px rgba(255, 255, 255, 0.8), 6px 6px 10px rgba(0, 0, 0, 0.2)",
                            color: "#6f6cd",
                            cursor: "pointer",
                        }}
                        >
                        SVM
                        </button>
                    </div>
                </div>
            </Div_txtShow>

            <Div_NB>
                <h3
                    style={{
                        lineHeight: "2",
                        display: "flex",
                        margin: "0vw 0vw 0vw 2vw",
                        height: "2vw",
                    }}
                >
                    {" "}
                    NB ( Naive Bayes )
                    {NBResult && (
                        <div>  :  {NBResult}</div>
                    )}
                </h3>

                <div
                    className="section"
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    {loading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                margin: "8vw",
                            }}
                        >
                            <Oval
                                height={80}
                                width={80}
                                color="#FF5F6D"
                                visible={loading}
                                ariaLabel="oval-loading"
                                secondaryColor="#FF5F6D"
                                strokeWidth={2}
                                strokeWidthSecondary={2}
                            />
                        </div>
                    ) : null}

                    {NBgraph.category.length != 0 && (
                        <div style={{ width: "100%", height: "120%" }}>
                            <div
                                style={{
                                    width: "27vw",
                                    height: "17vw",
                                    padding: "3vw 0vw 0vw 0vw",
                                }}
                            >
                                <Bar data={NBchartData} options={options} style={{}} />
                            </div>
                        </div>
                    )}
                </div>
            </Div_NB>

            <Div_SVM>
                <h3
                    style={{
                        lineHeight: "2",
                        display: "flex",
                        margin: "0vw 0vw 0vw 2vw",
                        height: "2vw",
                    }}
                >
                    {" "}
                    SVM ( Support Vector Machine )
                    {SVMResult && (
                        <div>  :  {SVMResult}</div>
                    )}
                </h3>
                <div
                    className="section"
                    style={{ display: "flex", justifyContent: "center" }}
                >
                    {loading ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                margin: "8vw",
                            }}
                        >
                            <Oval
                                height={80}
                                width={80}
                                color="#FFC371"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={loading}
                                ariaLabel="oval-loading"
                                secondaryColor="#FFC371"
                                strokeWidth={2}
                                strokeWidthSecondary={2}
                            />
                        </div>
                    ) : null}

                    {SVMgraph.category.length != 0 && (
                        <div style={{ width: "100%", height: "120%" }}>
                            <div
                                style={{
                                    width: "27vw",
                                    height: "17vw",
                                    padding: "3vw 0vw 0vw 0vw",
                                }}
                            >
                                <Bar data={SVMchartData} options={options} style={{}} />
                            </div>
                        </div>
                    )}
                </div>
            </Div_SVM>
        </div>
    );
}
