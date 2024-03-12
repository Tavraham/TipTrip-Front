// Import useState hook
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import axios from "axios";

const PostForm = ({ post }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(post ? post.photo : null); // Set the initial image URL

  const form = useForm({
    defaultValues: {
      caption: post ? post.description : "",
    },
  });

  async function onSubmit(values: { caption: string }) {
    try {
      const formData = new FormData();
      formData.append("name", localStorage.getItem("name") || "");
      formData.append("description", values.caption);
      formData.append("file", form.getValues('file')); // Retrieve file value from form
      await axios.post("http://localhost:3000/posts/createPost", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      navigate(-1);
    } catch (error) {
      console.error("Submission error:", error);
    }
  }
  
  async function onUpdate(values: { caption: string }) {
    try {
      const formData = new FormData();
      formData.append("description", values.caption);
      formData.append("file", form.getValues('file')); // Retrieve file value from form
      await axios.put(
        `http://localhost:3000/posts/updatePost/${post._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      navigate(-1);
    } catch (error) {
      console.error("Submission error:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={
          post
            ? form.handleSubmit(onUpdate)
            : form.handleSubmit(onSubmit)
        }
        className="flex-col gap-9 w-full max-w-5xl"
      >
        {/* caption */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        {/* photo */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={(file) => {
                  field.onChange(file);
                  // If file exists (i.e., image is uploaded), update imageUrl state
                  if (file) {
                    setImageUrl(URL.createObjectURL(file));
                  }
                }} imageUrl={imageUrl} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button type="button" onClick={()=> navigate(-1)} className="shad-button_dark_4">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
