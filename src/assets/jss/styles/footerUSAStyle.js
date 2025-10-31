import styled from 'styled-components';

export const Box = styled.div`
padding: 80px 0;
background: #fff;

width: 100%;


@media (max-width: 1000px) {
	padding: 30px;
}
`;

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	max-width: 1400px;
	margin: 0 auto;
	/* background: red; */
`

export const Column = styled.div`
display: flex;
flex-direction: column;
text-align: left;
margin-left: 60px;
`;

export const Row = styled.div`
display: grid;
grid-template-columns: repeat(auto-fill,
						minmax(300px, 1fr));
grid-gap: 20px;

@media (max-width: 1000px) {
	grid-template-columns: repeat(auto-fill,
						minmax(300px, 1fr));
}
`;

export const FooterLink = styled.a`
color: #333;
margin-bottom: 10px;
font-size: 12.8px;
text-decoration: none;

&:hover {
	color: green;
	transition: 200ms ease-in;
}
`;

export const Heading = styled.p`
font-size: 16.8px;
color: #333;
margin-bottom: 10px;
font-weight: bold;
`;
