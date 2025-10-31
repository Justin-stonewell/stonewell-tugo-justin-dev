import React from "react";
import {
Box,
Container,
Row,
Column,
FooterLink,
Heading,
} from "../../../assets/jss/styles/footerUSAStyle";

const FooterUSA = () => {
return (
	<Box>
	{/* <h1 style={{ color: "green",
				textAlign: "center",
				marginTop: "-50px" }}>
		GeeksforGeeks: A Computer Science Portal for Geeks
	</h1> */}
	<Container>
		<Row>
		<Column>
			<Heading>QUICK LINKS</Heading>
			<FooterLink href="https://stonewell.brokersnexus.com/international-health-insurance-by-destination/">Health Insurance by Destination</FooterLink>
			<FooterLink href="https://stonewell.brokersnexus.com/travel-insurance-coverage-by-activity/">Travel Insurance by Activity</FooterLink>
			<FooterLink href="https://stonewell.brokersnexus.com/travel-insurance-coverage-by-destination/">Travel Insurance by Destination</FooterLink>
            <FooterLink href="https://stonewell.brokersnexus.com/visitors-insurance-types/">Visitor Insurance Types</FooterLink>
            <FooterLink href="https://stonewell.brokersnexus.com/visitors-insurance/">Visitors to U.S.A.</FooterLink>
		</Column>
		<Column>
			<Heading>Students Plan</Heading>
			<FooterLink href="https://stonewell.brokersnexus.com/international-student-insurance/">International Student Insurance</FooterLink>
			<FooterLink href="https://stonewell.brokersnexus.com/study-abroad-insurance/">Study Abroad Insurance</FooterLink>
			<FooterLink href="https://stonewell.brokersnexus.com/opt-medical-insurance/">OPT</FooterLink>
            <FooterLink href="https://stonewell.brokersnexus.com/opt-medical-insurance/">J1/J2 Visa Exchange Visitor Insurance</FooterLink>
            <FooterLink href="https://stonewell.brokersnexus.com/medical-evacuation-and-repatriation-insurance/">Medical Evacuation & Repatriation Insurance</FooterLink>
		</Column>
		<Column>
			<Heading>International Medical</Heading>
			<FooterLink href="https://stonewell.brokersnexus.com/visitors-insurance/">Visitor Medical Insurance for Visitors to USA</FooterLink>
			<FooterLink href="https://stonewell.brokersnexus.com/travel-health-insurance/">Travel Health Insurance - For Outside US</FooterLink>
			<FooterLink href="https://stonewell.brokersnexus.com/schengen-visa-insurance/">Schengen Visa Insurance</FooterLink>
            <FooterLink href="https://stonewell.brokersnexus.com/new-immigrant-insurance/">New Immigrants to USA</FooterLink>
            <FooterLink href="https://stonewell.brokersnexus.com/green-card-holders-visiting-usa-insurance/">Greencard Holders Temporarily Visiting USA</FooterLink>
			<FooterLink href="https://stonewell.brokersnexus.com/expatriate-health-insurance/">Expatriate Health Insurance</FooterLink>
		</Column>
        <Column>
			<Heading>Learn</Heading>
			<FooterLink href="https://stonewell.brokersnexus.com/ask-our-specialists/">Ask Our Specialists</FooterLink>
			<FooterLink href="https://stonewell.brokersnexus.com/international-health-insurance-claims/">Claims Process and FAQ</FooterLink>
			<FooterLink href="https://stonewell.brokersnexus.com/international-medical-insurance-glossary/">International Medical Insurance Glossary</FooterLink>
			<FooterLink href="https://stonewell.brokersnexus.com/guide/">Insurance Guide</FooterLink>
            <FooterLink href="https://stonewell.brokersnexus.com/video-library/">Video Library</FooterLink>
		</Column>
		</Row>
	</Container>
	</Box>
);
};
export default FooterUSA;
