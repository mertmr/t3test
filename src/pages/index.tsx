import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { Leave } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "afrom Megrt" });
  const leaves = api.leave.getAllLeaves.useQuery();
  const createLeaveMutation = api.leave.create.useMutation({
    onSuccess: () => {
      ctx.leave.getAllLeaves.invalidate();
    },
  });

  const ctx = api.useContext();

  const deleteMutation = api.leave.deleteLeave.useMutation({
    onSuccess: () => {
      // setInput("");
      void ctx.leave.getAllLeaves.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to delete leave! Please try again later.");
      }
    },
  });

  const dayjs = require("dayjs");
  var customParseFormat = require("dayjs/plugin/customParseFormat");
  dayjs.extend(customParseFormat);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(event);
    const { name, startDate, endDate, reason } = event.target.elements;
    const date = dayjs(startDate.value, "YYYY-MM-DD");
    createLeaveMutation.mutate({
      name: name.value,
      startDate: dayjs(startDate.value, "YYYY-MM-DD").toDate(),
      endDate: dayjs(endDate.value).toDate(),
      reason: reason.value,
    });
    // startDate.value = '';
    // endDate.value = '';
    // reason.value = '';
  };

  return (
    <div>
      <div>
        <Head>
          <title>Create T3 App</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
            </h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Leave Balance</CardTitle>
                  <CardDescription>Days</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>14</p>
                </CardContent>
              </Card>
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="https://create.t3.gg/en/introduction"
                target="_blank"
              >
                <h3 className="text-2xl font-bold">Documentation →</h3>
                <div className="text-lg">
                  Learn more about Create T3 App, the libraries it uses, and how
                  to deploy it.
                </div>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl text-white">
                {hello.data ? hello.data.greeting : "Loading tRPC query..."}
              </p>
              <AuthShowcase />
            </div>
          </div>
        </main>{" "}
      </div>
      <div className="mx-auto max-w-md py-8">
        <h1 className="mb-4 text-3xl font-bold">Leave Application</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="name" className="mb-2 block">
              Name:
            </label>
            <input
              type="text"
              id="name"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="mb-2 block">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="mb-2 block">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reason" className="mb-2 block">
              Reason:
            </label>
            <input
              type="text"
              id="reason"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow"
            />
          </div>
          <Button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600">
            Submit Leave
          </Button>
        </form>
        <h2 className="mb-4 text-2xl font-bold">Leaves</h2>
        {leaves && leaves.data ? (
          <ul>
            {leaves.data.map((leave: Leave) => (
              <li
                key={leave.id}
                className="mb-2 rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
              >
                <div>Name: {leave.name}</div>
                <div>
                  Start Date: {dayjs(leave.startDate).format("DD-MM-YYYY")} -
                  End Date: {dayjs(leave.endDate).format("DD-MM-YYYY")}
                </div>
                <div>Reason: {leave.reason}</div>
                <button
                  onClick={() => deleteMutation.mutate({ id: leave.id })}
                  className="mt-2 rounded-md bg-red-500 px-4 py-2 text-white shadow hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading leaves...</p>
        )}
      </div>
    </div>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {secretMessage} asd1
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
