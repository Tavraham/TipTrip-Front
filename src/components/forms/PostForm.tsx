// Import useState hook
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
  FormField,
  FormItem,
  
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import axios from "axios";
import { createPostRoute, host, updatePostRoute } from "@/utils/apiRoutes";
import { useToast } from "@/components/ui/use-toast";

const PostForm = ({ post }: { post: {_id: string; profilePic: string; name: string; description: string; photo: string} | null }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(
    post ? `${host}/${post.photo.replace('..', '')}` : null
  );
  
  const form = useForm({
    defaultValues: {
      caption: post ? post.description : "",
      file: "",
    },
  });

  async function onSubmit(values: { caption: string }) {
    try {
      const formData = new FormData();
      formData.append("name", localStorage.getItem("name") || "");
      formData.append("description", values.caption);
      formData.append("file", form.getValues('file')); // Retrieve file value from form

      // Validate if both caption and file are provided
      if (!values.caption || !form.getValues('file')) {
        toast({title:"Please provide both caption and picture."});
        return;
      }

      await axios.post(createPostRoute, formData, {
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
        `${updatePostRoute}/${post?._id}`,
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
