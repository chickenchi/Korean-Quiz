"use client";
import { useAtom } from "jotai";
import { useEffect, useState, useRef, ChangeEvent } from "react";

import TextareaAutosize from "react-textarea-autosize";

const Header = () => {
  return (
    <div className="w-full h-[15%] flex items-center justify-center">
      <h1 className="text-3xl">문제 생성</h1>
    </div>
  );
};

const Section = () => {
  const textareaStyle = `w-[100%] h-[auto] mt-2 p-2
          border border-gray-300 rounded-md
          px-4 py-3
          outline-none resize-none`;

  const subtitleStyle = `text-2xl`;

  const buttonStyle = `flex-1 px-4 py-2
        border border-[#727272]
        text-[#727272] outline-none`;

  const [selectedView, setSelectedView] = useState<
    "none" | "image" | "article"
  >("none");

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // 파일이 없을 수도 있으니 옵셔널 체이닝

    if (file) {
      // 메모리 효율이 좋은 방식
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // (선택사항) 메모리 누수 방지 로직이 필요하다면 여기에 추가
    }
  };

  return (
    <div
      id="section"
      className="w-full h-[75%] overflow-y-auto
    [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div id="question-title-container" className="w-[90%] mb-8 ml-4">
        <h2 className={subtitleStyle}>
          지시문<span className="text-[#D52E7C]">*</span>
        </h2>
        <TextareaAutosize
          className={textareaStyle}
          placeholder="지시문을 입력하세요"
        />
      </div>
      <div id="type-container" className="w-[90%] mb-8 ml-4">
        <h2 className={subtitleStyle}>
          문제 유형<span className="text-[#D52E7C]">*</span>
        </h2>
      </div>
      <div id="tag-container" className="w-[90%] mb-8 ml-4 flex items-center">
        <h2 className={subtitleStyle}>
          태그<span className="text-[#D52E7C]">*</span>
        </h2>
        <div
          className="ml-4 px-3 py-1
        border border-[#727272] rounded-2xl 
        text-[#727272]
        flex items-center"
        >
          실험용
        </div>
      </div>
      <div id="hint-container" className="w-[90%] mb-8 ml-4">
        <h2 className={subtitleStyle}>
          힌트<span className="text-[#D52E7C]">*</span>
        </h2>
        <TextareaAutosize
          className={textareaStyle}
          placeholder="힌트를 입력하세요"
        />
      </div>
      <div id="view-container" className="w-[90%] mb-8 ml-4">
        <h2 className={subtitleStyle}>
          보기<span className="text-[#D52E7C]">*</span>
        </h2>
        <div id="button-group" className="flex w-full mt-2">
          <button
            className={`border-r-0 
            ${selectedView === "image" ? "rounded-tl-md" : "rounded-l-md"}
            ${buttonStyle}
            ${selectedView === "none" ? "bg-[#f2f2f280]" : ""}
            active:bg-[#f2f2f2]`}
            onClick={() => setSelectedView("none")}
          >
            없음
          </button>
          <button
            className={`${buttonStyle}
            ${selectedView === "image" ? "bg-[#F2F2F2]" : ""}
            active:bg-[#f2f2f2]`}
            onClick={() => setSelectedView("image")}
          >
            사진
          </button>
          <button
            className={`border-l-0
            ${selectedView === "image" ? "rounded-tr-md" : "rounded-r-md"}
            ${buttonStyle}
            ${selectedView === "article" ? "bg-[#F2F2F2]" : ""}
            active:bg-[#f2f2f2]`}
            onClick={() => setSelectedView("article")}
          >
            본문
          </button>
        </div>
        {selectedView === "image" ? (
          <div
            id="image-upload-container"
            className="w-full p-4 flex flex-row
            border border-t-0 border-[#727272] rounded-b-md"
          >
            <input
              id="image-upload"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label htmlFor="image-upload">
              <div
                className="w-26 h-26
                border border-gray-400 rounded-md
                flex items-center justify-center"
              >
                {preview ? (
                  <div className="w-full h-full bg-black">
                    <img
                      src={preview}
                      alt="업로드 미리보기"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <svg width="35" height="35" viewBox="0 0 27 27" fill="none">
                    <path
                      d="M23.2097 0H3.77517C2.77393 0 1.8137 0.39774 1.10572 1.10572C0.39774 1.8137 0 2.77393 0 3.77517V23.2248C0.00278936 24.2252 0.401425 25.1838 1.1088 25.8912C1.81618 26.5986 2.77479 26.9972 3.77517 27H23.2097C24.2101 26.9972 25.1687 26.5986 25.8761 25.8912C26.5835 25.1838 26.9821 24.2252 26.9849 23.2248V3.77517C26.9849 3.27941 26.8873 2.7885 26.6975 2.33047C26.5078 1.87245 26.2297 1.45628 25.8792 1.10572C25.5286 0.755164 25.1125 0.477087 24.6544 0.287368C24.1964 0.0976476 23.7055 0 23.2097 0ZM1.51007 3.77517C1.51007 3.17443 1.74871 2.59829 2.1735 2.1735C2.59829 1.74871 3.17443 1.51007 3.77517 1.51007H23.2097C23.8105 1.51007 24.3866 1.74871 24.8114 2.1735C25.2362 2.59829 25.4748 3.17443 25.4748 3.77517V16.8523L19.6158 10.9933C19.1891 10.5728 18.6142 10.337 18.0151 10.337C17.4161 10.337 16.8411 10.5728 16.4144 10.9933L9.52852 17.8943C9.3843 18.0325 9.19224 18.1097 8.99245 18.1097C8.79266 18.1097 8.6006 18.0325 8.45638 17.8943L7.61074 17.0487C7.18223 16.6317 6.60795 16.3984 6.01007 16.3984C5.41219 16.3984 4.8379 16.6317 4.4094 17.0487L1.51007 19.948V3.77517ZM25.4748 23.2248C25.4748 23.8256 25.2362 24.4017 24.8114 24.8265C24.3866 25.2513 23.8105 25.4899 23.2097 25.4899H3.77517C3.17443 25.4899 2.59829 25.2513 2.1735 24.8265C1.74871 24.4017 1.51007 23.8256 1.51007 23.2248V22.0923L5.48909 18.1208C5.63094 17.9841 5.82061 17.9082 6.01762 17.9094C6.21925 17.9075 6.4139 17.9831 6.56124 18.1208L7.39178 18.9664C7.81842 19.387 8.3934 19.6227 8.99245 19.6227C9.5915 19.6227 10.1665 19.387 10.5931 18.9664L17.4941 12.0654C17.5643 11.9947 17.6478 11.9385 17.7398 11.9002C17.8318 11.8618 17.9305 11.8421 18.0302 11.8421C18.1299 11.8421 18.2286 11.8618 18.3206 11.9002C18.4126 11.9385 18.4961 11.9947 18.5663 12.0654L25.4824 18.9815L25.4748 23.2248Z"
                      fill="#727272"
                    />
                    <path
                      d="M7.54617 11.3333C6.79951 11.3333 6.06962 11.1119 5.44879 10.6971C4.82797 10.2822 4.3441 9.69264 4.05837 9.00282C3.77263 8.313 3.69787 7.55394 3.84354 6.82163C3.9892 6.08932 4.34875 5.41665 4.87672 4.88868C5.40469 4.36072 6.07736 4.00117 6.80967 3.8555C7.54198 3.70983 8.30104 3.78459 8.99086 4.07033C9.68068 4.35606 10.2703 4.83993 10.6851 5.46076C11.0999 6.08158 11.3213 6.81147 11.3213 7.55813C11.3213 8.55936 10.9236 9.51959 10.2156 10.2276C9.50763 10.9356 8.5474 11.3333 7.54617 11.3333ZM7.54617 5.29303C7.09817 5.29303 6.66024 5.42587 6.28774 5.67477C5.91525 5.92366 5.62493 6.27742 5.45349 6.69131C5.28205 7.1052 5.23719 7.56064 5.32459 8.00003C5.41199 8.43941 5.62772 8.84302 5.9445 9.1598C6.26128 9.47658 6.66488 9.69231 7.10427 9.77971C7.54365 9.8671 7.99909 9.82225 8.41298 9.65081C8.82688 9.47937 9.18063 9.18904 9.42953 8.81655C9.67842 8.44406 9.81127 8.00612 9.81127 7.55813C9.81127 6.95739 9.57262 6.38125 9.14783 5.95646C8.72305 5.53167 8.14691 5.29303 7.54617 5.29303Z"
                      fill="#727272"
                    />
                  </svg>
                )}
              </div>
            </label>

            <div id="image-requirements" className="ml-4">
              <p className="mt-0.5 text-sm text-gray-500">
                사진 크기: <span className="text-black">180x180px 이하</span>
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                사진 용량: <span className="text-black">256MB 이하</span>
              </p>
              <p className="mt-0.5 text-sm text-[#D52E7C]">
                법에 저촉되는 사진은 예술고등학교 없이 삭제될 수 있으며, 이에
                대해 책임을 지지 않습니다.
              </p>
            </div>
          </div>
        ) : selectedView === "article" ? (
          <TextareaAutosize
            className={textareaStyle}
            placeholder="본문 내용 입력"
          />
        ) : null}
      </div>
      <div id="solution-container" className="w-[90%] mb-8 ml-4">
        <h2 className={subtitleStyle}>
          해설<span className="text-[#D52E7C]">^</span>
        </h2>
        <TextareaAutosize
          className={textareaStyle}
          placeholder="해설을 입력하세요"
        />
      </div>
      <div id="explanation-container" className="w-[90%] mb-8 ml-4">
        <h2 className={subtitleStyle}>
          선지별 해설<span className="text-[#D52E7C]">^</span>
        </h2>
        <TextareaAutosize
          className={textareaStyle}
          placeholder="해설을 입력하세요"
        />
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="w-full h-[10%] flex items-center justify-center">
      <button
        className="px-4 py-2 bg-transparent
      border border-[#727272] rounded-md mr-2
      text-[#727272]"
      >
        생성 요청
      </button>
      <button
        className="px-4 py-2 bg-transparent
      border border-[#727272] rounded-md
      text-[#727272]"
      >
        미리 보기
      </button>
    </div>
  );
};

export default function MakeQuiz() {
  return (
    <div className="w-full h-full">
      <Header />
      <Section />
      <Footer />
    </div>
  );
}
