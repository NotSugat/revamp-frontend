import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "../datePicker";
import { SetGoal } from "@/graphql/mutations.graphql";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { useForm, type FieldValues } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setGoalChange } from "@/redux/features/goalSlice";

const CreateGoalDialog = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm();
	const { user } = useUser();
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);

	const [setGoal, { error }] = useMutation(SetGoal);
	const dispatch = useDispatch<AppDispatch>();

	const onSubmit = (data: FieldValues) => {
		setGoal({
			variables: {
				userId: user?.id,
				title: data.title,
				description: data.description,
			},
		});
		if (!isSubmitting) {
			reset();
			dispatch(setGoalChange());
			setDialogOpen(!dialogOpen);
		}
	};

	return (
		<Dialog
			open={dialogOpen}
			onOpenChange={() => {
				setDialogOpen(!dialogOpen);
				reset();
			}}
		>
			<DialogTrigger asChild>
				<Button variant="outline">Create Goal</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Goal</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you are done.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right text-foreground">
							Title
						</Label>
						<Input
							{...register("title", {
								required: "Please enter a title before submitting",
								minLength: {
									value: 3,
									message: "Please enter a title with at least 3 characters",
								},
								maxLength: {
									value: 100,
									message: "Please enter a title with fewer than 100 characters",
								},
							})}
							placeholder="tasks..."
							className="col-span-3 placeholder-red-500"
						/>
					</div>
					{errors.title && (
						<p className="text-center text-xs text-red-500 ">{`${errors.title.message}`}</p>
					)}
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="username" className="text-right text-foreground">
							Description
						</Label>
						<Input
							{...register("description", {
								maxLength: {
									value: 255,
									message: "Please enter a description with fewer than 255 characters",
								},
							})}
							placeholder="Description..."
							className="col-span-3"
						/>
						{errors.description && (
							<p className="text-xs text-red-500">{`${errors.description.message}`}</p>
						)}
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="username" className="text-right text-foreground">
							priority
						</Label>
						<Input {...register("priority")} placeholder="priority..." className="col-span-3" />
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="username" className="text-right text-foreground">
							deadline
						</Label>
						<DatePicker />
					</div>{" "}
					<DialogFooter>
						{error && <p className="text-foreground">Error: {error.message}</p>}
						<Button disabled={isSubmitting} type="submit">
							Save changes
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateGoalDialog;
