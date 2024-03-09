import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const form = useForm({
    defaultValues: {
      caption: post ? post.caption : "",
      file: post ? post.imageUrl : "",
    },
  });

  async function onSubmit(values: { caption: string; file: File }) {
    try {
      console.log("Form values:", {
        caption: values.caption,
        file: values.file,
      });

      const formData = new FormData();
      formData.append("owner",localStorage.getItem("Id") || "");
      formData.append("description", values.caption);
      formData.append("photo", values.file.name);

      await axios.post("http://localhost:3000/posts/createPost", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data"
        },
      });

      // Navigate or handle success as needed
    } catch (error) {
      console.error("Submission error:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
                <FileUploader fieldChange={field.onChange} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
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
