// EditorPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import TiptapEditor from "./TiptapEditor";
import toast from "react-hot-toast";

const TOKEN_LIST = [
  "employee_name",
  "current_date",
  "amount",
  "Effective Date",
  "day_number",
  "month",
  "year",
];

export default function EditorPage() {
  const [documents, setDocuments] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [headerHeight, setHeaderHeight] = useState(100);
  const [footerHeight, setFooterHeight] = useState(100);
  // const [letterhead, setLetterhead] = useState("");
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [headerImage, setHeaderImage] = useState("");
  const [footerImage, setFooterImage] = useState("");

  const handleUpload = async (e, type) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("type", type);

    const res = await axios.post(
      "https://document-template-services.onrender.com/upload",
      formData
    );

    if (type === "header") {
      setHeaderImage(res.data.filePath);
    } else {
      setFooterImage(res.data.filePath);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // const handleUpload = async (e) => {
  //   if (!e.target.files?.[0]) return;
  //   const formData = new FormData();
  //   formData.append("file", e.target.files?.[0]);

  //   const res = await axios.post("https://document-template-services.onrender.com/upload", formData);
  //   setLetterhead(res.data.filePath);
  // };

  const insertToken = (token) => {
    editor.chain().focus().insertContent(`{{${token}}}`).run();
    setSelectedTokens((prev) => [...new Set([...prev, token])]);
  };

  const saveDocument = async () => {
    if (!title || !content) return alert("Please fill all the fields");
    try {
      toast("Saving...");
      await axios.post(
        "https://document-template-services.onrender.com/documents",
        {
          title,
          content,
          tokens: selectedTokens,

          headerHeight,
          footerHeight,

          headerImage,
          footerImage,
        }
      );
      alert("Saved");
    } catch (e) {
      console.error("error in saving", e, e.response);
    } finally {
      toast.dismiss();
    }
  };

  const downloadDocument = async (id) => {
    try {
      toast("Downloading...");
      const response = await axios.get(
        `https://document-template-services.onrender.com/download/${id}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "document.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log("error in downloading", error, error?.response);
    } finally {
      toast.dismiss();
    }
  };

  const generateDocument = async (id) => {
    try {
      toast("Generating...");
      const response = await axios.get(
        `https://document-template-services.onrender.com/generate/${id}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "document.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log("error in generating", error, error?.response);
    } finally {
      toast.dismiss();
    }
  };

  useEffect(() => {
    toast("Fetching documents...");
    axios
      .get("https://document-template-services.onrender.com/documents")
      .then((res) => {
        console.log(res.data);
        setDocuments(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        toast.dismiss();
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Document</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div style={{ margin: "10px 0" }}>
        {TOKEN_LIST.map((t) => (
          <button key={t} onClick={() => insertToken(t)}>
            {t}
          </button>
        ))}
      </div>

      <TiptapEditor content={content} setContent={setContent} editor={editor} />

      <div>
        <label>Header Height</label>
        <input
          type="number"
          value={headerHeight}
          onChange={(e) => setHeaderHeight(e.target.value)}
        />

        <label>Footer Height</label>
        <input
          type="number"
          value={footerHeight}
          onChange={(e) => setFooterHeight(e.target.value)}
        />
      </div>

      <div>
        <label>Header Image</label>
        <input type="file" onChange={(e) => handleUpload(e, "header")} />
      </div>

      <div>
        <label>Footer Image</label>
        <input type="file" onChange={(e) => handleUpload(e, "footer")} />
      </div>
      {/* <div>
        <input type="file" onChange={handleUpload} />
        {letterhead && (
          <img src={`https://document-template-services.onrender.com${letterhead}`} width="200" />
        )}
      </div> */}

      <button onClick={saveDocument}>Save</button>

      {documents?.map((doc) => (
        <button onClick={() => downloadDocument(doc._id)}>
          {doc.title || "download"}
        </button>
      ))}

      {documents?.map((doc) => (
        <button onClick={() => generateDocument(doc._id)}>
          Generate {doc.title || "download"}
        </button>
      ))}
      <button onClick={() => downloadDocument("69c24b9d78a2cff350e27f5b")}>
        Download PDF
      </button>
    </div>
  );
}
