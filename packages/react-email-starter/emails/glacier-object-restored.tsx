import * as React from 'react';
import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from '@react-email/components';

export function GlacierObjectRestored({
	signedUrl = 'https://exanubes.com',
	expiry = '2023-12-31'
}) {
	return (
		<Html>
			<Head />
			<Preview>Your document is ready!</Preview>
			<Tailwind>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
						<Section className="mt-[32px]">
							<Img
								src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg"
								width="40"
								alt="blue bird"
								className="mx-auto my-0"
							/>
						</Section>
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							Document you requested is ready for download until {expiry}
						</Heading>
						<Section className="mb-[32px] mt-[32px] text-center">
							<Link
								href={signedUrl}
								className="cursor-pointer rounded bg-blue-400 px-4 py-3 text-white no-underline hover:bg-blue-800"
							>
								Download now
							</Link>
						</Section>
						<Text className="text-[14px] leading-[24px] text-black">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias consectetur corporis
							culpa dicta distinctio excepturi exercitationem fugiat harum illo inventore ipsa ipsam
							iste, itaque maxime nemo nesciunt optio quae quas quidem reiciendis soluta velit vero
							voluptas voluptate voluptatibus voluptatum.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export default GlacierObjectRestored;
