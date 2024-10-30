"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });

      if (response?.error) {
        toast.error("Böyle bir kullanıcı bulunmamaktadır");
        return;
      }

      event.currentTarget.reset();

      router.replace("admin");
    } catch (error) {
      toast.error(
        "Bir hata oluştu: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-color7">
      <form
        className="flex flex-col bg-white w-full md:w-2/3 lg:w-1/4 gap-5 p-[50px]"
        onSubmit={submitLogin}
      >
        <input
          required
          type="email"
          name="email"
          id="email"
          placeholder="Email ..."
          className="p-2.5 border-b-[gray] border-none border-b border-solid"
        />
        <input
          required
          type="password"
          name="password"
          id="password"
          placeholder="Şifre ..."
          className="p-2.5 border-b-[gray] border-none border-b border-solid"
        />
        <button
          type="submit"
          className={`bg-red-700 cursor-pointer text-white p-2.5 border-none font-semibold ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
