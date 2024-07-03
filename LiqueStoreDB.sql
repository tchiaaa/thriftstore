--
-- PostgreSQL database dump
--

-- Dumped from database version 14.11
-- Dumped by pg_dump version 14.11

-- Started on 2024-07-02 21:39:27

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 122896)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 172294)
-- Name: absensi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.absensi (
    id integer NOT NULL,
    employeeid integer,
    username character varying(25),
    password character varying(255),
    clockin timestamp without time zone,
    clockout timestamp without time zone,
    todaydate date
);


ALTER TABLE public.absensi OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 172297)
-- Name: absensi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.absensi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.absensi_id_seq OWNER TO postgres;

--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 211
-- Name: absensi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.absensi_id_seq OWNED BY public.absensi.id;


--
-- TOC entry 212 (class 1259 OID 172298)
-- Name: accessright; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accessright (
    id integer NOT NULL,
    "position" character varying(25)
);


ALTER TABLE public.accessright OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 172301)
-- Name: accessright_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accessright_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accessright_id_seq OWNER TO postgres;

--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 213
-- Name: accessright_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accessright_id_seq OWNED BY public.accessright.id;


--
-- TOC entry 214 (class 1259 OID 172302)
-- Name: type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.type (
    id integer NOT NULL,
    nama character varying(255) NOT NULL,
    weight integer NOT NULL,
    lastupdate timestamp without time zone,
    varian character varying(255) NOT NULL,
    typecode character varying(10) NOT NULL
);


ALTER TABLE public.type OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 172307)
-- Name: type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.type_id_seq OWNER TO postgres;

--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 215
-- Name: type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.type_id_seq OWNED BY public.type.id;


--
-- TOC entry 216 (class 1259 OID 172308)
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    id integer DEFAULT nextval('public.type_id_seq'::regclass) NOT NULL,
    addressname character varying(25) NOT NULL,
    addressdetail character varying(255) NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(50) NOT NULL,
    zipcode integer NOT NULL,
    note character varying(255),
    customerid integer NOT NULL,
    cityid integer NOT NULL
);


ALTER TABLE public.address OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 172314)
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id integer DEFAULT nextval('public.type_id_seq'::regclass) NOT NULL,
    name character varying(255) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    usernameig character varying(50) NOT NULL,
    phonenumber character varying(15) NOT NULL,
    birthdate timestamp(6) without time zone NOT NULL,
    accessrightid integer NOT NULL,
    status character varying(25) NOT NULL
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 172320)
-- Name: detailorders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detailorders (
    id integer DEFAULT nextval('public.type_id_seq'::regclass) NOT NULL,
    orderid character varying(20) NOT NULL,
    totalweight integer NOT NULL,
    deliveryprice integer NOT NULL,
    totalprice integer NOT NULL,
    paymentdate timestamp without time zone NOT NULL
);


ALTER TABLE public.detailorders OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 172324)
-- Name: employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee (
    id integer NOT NULL,
    username character varying(25) NOT NULL,
    fullname character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    birthdate date NOT NULL,
    password character varying(255) NOT NULL,
    phonenumber character varying(15) NOT NULL,
    accessrightid integer NOT NULL,
    status character varying(25) NOT NULL,
    firstjoindate timestamp without time zone NOT NULL,
    lastupdate timestamp without time zone,
    jam_masuk time without time zone NOT NULL,
    jadwal_libur character varying(10) NOT NULL
);


ALTER TABLE public.employee OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 172329)
-- Name: emplyoee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emplyoee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.emplyoee_id_seq OWNER TO postgres;

--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 220
-- Name: emplyoee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emplyoee_id_seq OWNED BY public.employee.id;


--
-- TOC entry 221 (class 1259 OID 172330)
-- Name: item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item (
    id integer NOT NULL,
    typeid integer NOT NULL,
    employeeid integer NOT NULL,
    name character varying(255) NOT NULL,
    size integer NOT NULL,
    lastupdate timestamp without time zone,
    customweight integer NOT NULL,
    customcapitalprice integer NOT NULL,
    customdefaultprice integer NOT NULL,
    files character varying(5000)[],
    status character varying NOT NULL,
    itemcode character varying(20) NOT NULL
);


ALTER TABLE public.item OWNER TO postgres;

--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN item.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.item.status IS 'available (hijau)
checkout (orange/kuning)
paid (biru)
sold (merah)';


--
-- TOC entry 222 (class 1259 OID 172335)
-- Name: item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.item_id_seq OWNER TO postgres;

--
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 222
-- Name: item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_id_seq OWNED BY public.item.id;


--
-- TOC entry 223 (class 1259 OID 172336)
-- Name: ordercolour; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ordercolour (
    id integer DEFAULT nextval('public.type_id_seq'::regclass) NOT NULL,
    name character varying(255) NOT NULL,
    colourcode character varying(10) NOT NULL,
    colourhex character varying(10)
);


ALTER TABLE public.ordercolour OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 172340)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    username character varying(25) NOT NULL,
    phonenumber character varying(15) NOT NULL,
    checkoutdate timestamp without time zone NOT NULL,
    paymentdate timestamp without time zone NOT NULL,
    packingdate timestamp without time zone,
    deliverypickupdate timestamp without time zone,
    deliverydonedate timestamp without time zone,
    status character varying(25) NOT NULL,
    id character varying(20) NOT NULL,
    itemidall character varying(255)[] NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN orders.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.orders.status IS '1 = Payment Not Done
2 = On Packing
3 = On Pick Up
4 = On Delivery
5 = Done';


--
-- TOC entry 225 (class 1259 OID 172345)
-- Name: temporaryorder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temporaryorder (
    id integer DEFAULT nextval('public.type_id_seq'::regclass) NOT NULL,
    orderid character varying(20) NOT NULL,
    colourid integer NOT NULL,
    username character varying(255),
    phonenumber character varying(15) NOT NULL,
    totalprice integer NOT NULL,
    totalweight integer NOT NULL,
    waitinglist character varying(255)[],
    itemidall character varying(255)[],
    link character varying(255),
    paymentdate timestamp without time zone,
    status character varying(25) NOT NULL,
    checkoutdate timestamp without time zone NOT NULL,
    masterorderid character varying(20) NOT NULL,
    isactive boolean
);


ALTER TABLE public.temporaryorder OWNER TO postgres;

--
-- TOC entry 3245 (class 2604 OID 172351)
-- Name: absensi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.absensi ALTER COLUMN id SET DEFAULT nextval('public.absensi_id_seq'::regclass);


--
-- TOC entry 3246 (class 2604 OID 172352)
-- Name: accessright id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accessright ALTER COLUMN id SET DEFAULT nextval('public.accessright_id_seq'::regclass);


--
-- TOC entry 3251 (class 2604 OID 172353)
-- Name: employee id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee ALTER COLUMN id SET DEFAULT nextval('public.emplyoee_id_seq'::regclass);


--
-- TOC entry 3252 (class 2604 OID 172354)
-- Name: item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item ALTER COLUMN id SET DEFAULT nextval('public.item_id_seq'::regclass);


--
-- TOC entry 3247 (class 2604 OID 172355)
-- Name: type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type ALTER COLUMN id SET DEFAULT nextval('public.type_id_seq'::regclass);


--
-- TOC entry 3429 (class 0 OID 172294)
-- Dependencies: 210
-- Data for Name: absensi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.absensi (id, employeeid, username, password, clockin, clockout, todaydate) FROM stdin;
8	10	budi	admin123	2024-05-19 10:33:55.551327	2024-05-19 20:11:34.551327	2024-05-19
9	10	budi	admin123	2024-06-19 22:49:34.668484	2024-06-19 23:45:56.290417	2024-06-19
10	10	budi	admin123	2024-06-20 00:14:42.470088	2024-06-20 00:23:24.882236	2024-06-20
11	10	budi	$2a$06$v1YT0SfH1ZBjG/hGeG5EPebSE5slYAaNZy5/Rauf/QScXvheEVkYe	2024-06-24 23:20:25.335259	2024-06-24 23:22:26.288268	2024-06-24
12	11	lino	$2a$06$uceFpazrvdCYdK0Q5AaV7e0eApmDLxuwLU71lrtFJ/yd8Tp.J2E7W	2024-06-24 23:39:28.376592	\N	2024-06-24
13	10	budi	$2a$06$v1YT0SfH1ZBjG/hGeG5EPebSE5slYAaNZy5/Rauf/QScXvheEVkYe	2024-06-25 00:17:55.29728	2024-06-25 00:19:46.13749	2024-06-25
14	41	miki	$2a$06$897xUH1r...kKsBomzK1Eucxn5kt.pPKQ4V5sw.dTjz5MDCzwS.eW	2024-06-25 00:32:07.077286	\N	2024-06-25
15	44	harry	$2a$10$IagloWKsGaTMDdqNschQPOUjsxRbUgz/.edSvrF868dyw2x29UNv2	2024-07-02 12:47:21.340075	2024-07-02 12:53:43.726469	2024-07-02
\.


--
-- TOC entry 3431 (class 0 OID 172298)
-- Dependencies: 212
-- Data for Name: accessright; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accessright (id, "position") FROM stdin;
1	admin
2	supervisor
3	manager
4	customer
\.


--
-- TOC entry 3435 (class 0 OID 172308)
-- Dependencies: 216
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.address (id, addressname, addressdetail, city, state, zipcode, note, customerid, cityid) FROM stdin;
132	home	mastrip 2	surabay	jawa timur	67567		21	1
134	school	kalinak nbarat	surabaya	jawa timur	8934		21	1
140	school	pantai melasti	surabaya	jawa timur	890321		139	1
141	work	darmo satelit indah	surabaya	jawa timur	883441	masuk gang sempit	139	1
144	Home	JL. Kaliurang Utara 9 / 10	Bangka Selatan	Bangka Belitung	645764		21	29
161	home	kaliurang barat 2	Surabaya	Jawa Timur	786773		160	444
165	home	rubngkut mapan 2	Surabaya	Jawa Timur	898934		164	444
\.


--
-- TOC entry 3436 (class 0 OID 172314)
-- Dependencies: 217
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, name, username, password, email, usernameig, phonenumber, birthdate, accessrightid, status) FROM stdin;
21	rich bryan	bryan	$2a$10$CxtlnEGaS/1kZgPnePQIeehQcclUJgQ8PF5ALlm1Ak1C2M0QiolnW	bryan@gmail.com	rich_brayn	023859345	2024-05-28 00:00:00	4	active
139	michael evan	michael	$2a$10$3/ESlFNzTM//Tkp/ZPlbE.rPqOYVgxIFFqTAy8pMPvrc7sLOpS8/u	techaw@gmail.com	teki_pai	034238585435	1995-11-16 00:00:00	4	active
159	christo	toto	$2a$10$IZ0taGtn0TdFB3R1oqDRK.Ix30gbFqqT4oZ//VDVtHdT8A1IQF5DS	toto@gmail.com	toto_	065678	2024-07-11 00:00:00	4	active
160	titik	titi	$2a$10$Adv0jnMwOh3DHWKKTx5.L.aVkeB4HzyP0tyxYmxPgfOaaE1ixyh0q	titi@gmail.com	titkie_	088	2002-03-09 00:00:00	4	active
164	andik	andi	$2a$10$x7.nN5xrhcimtl4zXqF7qORBzLxXkZXWtj8xpgkYN/7wc7pglISeq	andi@gmail.com	andi_	333	2024-07-11 00:00:00	4	active
171	michelle louise	michelle	$2a$10$VmBAeosV2nGWupybxxpZ/.DT6nkAkLeqPqLa.t642fY7pE/1drMeK	michelle@gmail.com	mich_elle	5647567	2024-07-04 00:00:00	4	active
\.


--
-- TOC entry 3437 (class 0 OID 172320)
-- Dependencies: 218
-- Data for Name: detailorders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detailorders (id, orderid, totalweight, deliveryprice, totalprice, paymentdate) FROM stdin;
2	U011240630	100	30000	52000	2024-06-30 23:11:57.737303
3	B005240630	150	35000	67000	2024-06-30 23:19:04.309321
162	U012240701	150	0	32000	2024-07-01 23:54:57.366077
166	U007240702	150	0	30000	2024-07-02 00:15:55.979973
\.


--
-- TOC entry 3438 (class 0 OID 172324)
-- Dependencies: 219
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee (id, username, fullname, email, birthdate, password, phonenumber, accessrightid, status, firstjoindate, lastupdate, jam_masuk, jadwal_libur) FROM stdin;
41	miki	mikasa	mikasa@gmail.com	2001-03-01	$2a$06$897xUH1r...kKsBomzK1Eucxn5kt.pPKQ4V5sw.dTjz5MDCzwS.eW	0982354345	1	inactive	2024-06-05 07:00:00	\N	14:35:00	sabtu
8	alvin	alvin putra	manager@gmail.com	2000-09-18	$2a$06$IF0B3JXThgK2tnXPbRN/Xeqodo.WaepmAconsETEAY2WZ50dhQou6	0877987234	3	active	2024-05-17 01:26:42.562503	\N	10:00:00	minggu
9	evan	michael evan	supervisor@gmail.com	2001-02-09	$2a$06$vF.D94MLGzDSpu6/jYonPuWv.vOP2oxmvn4hERWdG6u6YTsHDxNzC	07889273483	2	active	2024-05-17 01:28:08.273531	\N	10:00:00	minggu
10	budi	budi raharjo	admin@gmail.com	2000-03-05	$2a$06$v1YT0SfH1ZBjG/hGeG5EPebSE5slYAaNZy5/Rauf/QScXvheEVkYe	0809874534	1	active	2024-05-17 01:29:11.279085	\N	10:00:00	minggu
45	niki	nikita	niki@gmail.com	1998-06-09	$2a$10$7yzjWpJ0UOJDIQrTSUnMtOsN/LW8jElxqG7LihmmMCP.2DNFTQO1e	089534534534	1	active	2023-03-31 07:00:00	2024-06-25 00:35:36.968253	10:40:00	sabtu
43	kimi	james	kim@gmail.com	2024-05-29	$2a$10$W4KkZTpx92P3rg63HNjD.O/AU2BC.LSuBpYBO9MxphYgcTJWDvqBe	087235442	2	suspended	2024-06-06 07:00:00	\N	23:50:00	sabtu
44	harry	harri	test@gmail.com	2004-03-04	$2a$10$IagloWKsGaTMDdqNschQPOUjsxRbUgz/.edSvrF868dyw2x29UNv2	08593534532	1	unknown	2024-06-06 07:00:00	2024-06-25 00:24:59.661853	00:28:00	kamis
11	lino	marcelino	marcelino@gmail.com	2000-06-06	$2a$06$uceFpazrvdCYdK0Q5AaV7e0eApmDLxuwLU71lrtFJ/yd8Tp.J2E7W	023878475394	1	inactive	2024-05-06 07:00:00	2024-07-02 15:08:07.860736	11:00:00	rabu
\.


--
-- TOC entry 3440 (class 0 OID 172330)
-- Dependencies: 221
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item (id, typeid, employeeid, name, size, lastupdate, customweight, customcapitalprice, customdefaultprice, files, status, itemcode) FROM stdin;
8	11	10	hoodie pull & bear	35	2024-06-28 13:31:36.112288	150	150000	250000	{centang.png,"guitar tutor.png"}	available	HS240500001
11	11	10	tas	45	2024-06-28 13:31:36.112288	150	150000	300000	{centang.png}	available	HS240600002
12	11	10	tas	45	2024-06-28 13:31:36.112288	150	150000	300000	{centang.png}	available	HS240600003
14	11	9	H&M	67	2024-06-28 13:31:36.112288	150	150000	300000	{centang.png,"guitar tutor.png"}	available	HS240600004
16	28	10	hakaido	56	2024-06-28 13:31:36.112288	150	150000	300000	{centang.png}	available	SC240600001
17	11	10	sepatu	100	2024-06-28 13:31:36.112288	100	200000	400000	{"1. IQ Test.png"}	available	HS240600006
18	11	10	yeezy	24	\N	100	30000	40000	{"guitar tutor.png"}	available	HS240700001
19	28	10	hert	0	2024-07-02 02:31:31.807003	150	3400	6553	\N	available	SC240700001
20	53	10	hokky	0	2024-07-02 02:41:53.050044	2000	34000	67000	{"1. IQ Test.png"}	available	B1240700001
\.


--
-- TOC entry 3442 (class 0 OID 172336)
-- Dependencies: 223
-- Data for Name: ordercolour; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ordercolour (id, name, colourcode, colourhex) FROM stdin;
13	Kuning	K	#FFFF00
14	Ungu	U	#A020F0
30	Hitam	H	#000000
31	Biru	B	#0000ff
32	Pink	P	#FFC0CB
\.


--
-- TOC entry 3443 (class 0 OID 172340)
-- Dependencies: 224
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (username, phonenumber, checkoutdate, paymentdate, packingdate, deliverypickupdate, deliverydonedate, status, id, itemidall) FROM stdin;
bryan	023859345	2024-06-30 22:56:34.396752	2024-06-30 23:12:16	\N	\N	\N	On Packing	U011240630	{HS240500001}
andi	333	2024-07-02 00:11:32.776912	2024-07-02 00:16:03	2024-07-02 00:47:40.14663	2024-07-02 00:47:56.177776	\N	On Delivery	U007240702	{HS240600005,SC240600001}
\.


--
-- TOC entry 3444 (class 0 OID 172345)
-- Dependencies: 225
-- Data for Name: temporaryorder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.temporaryorder (id, orderid, colourid, username, phonenumber, totalprice, totalweight, waitinglist, itemidall, link, paymentdate, status, checkoutdate, masterorderid, isactive) FROM stdin;
145	K001240630	13	bryan	023859345	20000	100	\N	\N	http://localhost:3000/login?orderid=K001240630	2024-06-30 13:37:27	On Packing	2024-06-30 12:01:26.516322	K001240630	t
146	K002240630	13	\N	898538094	50000	150	\N	\N	http://localhost:3000/login?orderid=K002240630	2024-06-30 22:05:22	On Packing	2024-06-30 12:01:26.516322	K002240630	t
147	K003240630	13	bryan	023859345	100000	2000	\N	\N	http://localhost:3000/login?orderid=K003240630	2024-06-30 13:37:27	On Packing	2024-06-30 12:01:26.516322	K001240630	t
148	K004240630	13	\N	0898930	15000	150	\N	\N	http://localhost:3000/login?orderid=K004240630	\N	Payment Not Done	2024-06-30 12:01:26.516322	K004240630	t
149	K005240630	13	\N	0898930	30000	150	\N	\N	http://localhost:3000/login?orderid=K005240630	\N	Payment Not Done	2024-06-30 12:01:26.516322	K004240630	t
155	B005240630	31	bryan	023859345	0	0	{}	{}	http://localhost:3000/login?orderid=B005240630	2024-06-30 23:19:07	On Packing	2024-06-30 23:18:23.215925	B005240630	t
156	U012240701	14	\N	088	30000	150	\N	\N	http://localhost:3000/login?orderid=U012240701	\N	Payment Not Done	2024-07-01 23:29:52.550097	U012240701	f
157	U015240701	14	\N	099	80000	2000	\N	\N	http://localhost:3000/login?orderid=U015240701	\N	Payment Not Done	2024-07-01 23:31:22.177674	U015240701	f
158	U008240701	14	\N	767889	9000	100	\N	\N	http://localhost:3000/login?orderid=U008240701	\N	Payment Not Done	2024-07-01 23:31:48.910385	U008240701	f
154	U011240630	14	bryan	023859345	20000	100	{}	{HS240500001}	http://localhost:3000/login?orderid=U011240630	2024-06-30 23:12:16	On Packing	2024-06-30 22:56:34.396752	U011240630	f
163	U007240702	14	andi	333	28000	150	{}	{HS240600005,SC240600001}	http://localhost:3000/login?orderid=U007240702	2024-07-02 00:16:03	On Packing	2024-07-02 00:11:32.776912	U007240702	f
174	K008240702	13	\N	5675653	30000	150	\N	\N	http://localhost:3000/login?orderid=K008240702	\N	Payment Not Done	2024-07-02 12:44:24.227838	K008240702	t
\.


--
-- TOC entry 3433 (class 0 OID 172302)
-- Dependencies: 214
-- Data for Name: type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.type (id, nama, weight, lastupdate, varian, typecode) FROM stdin;
11	Hoodie	100	2024-06-25 00:13:52.34335	Sport	HS
28	Sweater	150	2024-06-25 00:14:07.936039	Canvas	SC
53	Borongan	2000	2024-06-26 19:57:04.358944	1	B1
54	Borongan	3000	2024-06-26 19:57:29.025767	2	B2
\.


--
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 211
-- Name: absensi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.absensi_id_seq', 15, true);


--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 213
-- Name: accessright_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accessright_id_seq', 4, true);


--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 220
-- Name: emplyoee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emplyoee_id_seq', 45, true);


--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 222
-- Name: item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_id_seq', 20, true);


--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 215
-- Name: type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.type_id_seq', 174, true);


--
-- TOC entry 3256 (class 2606 OID 172357)
-- Name: absensi absensi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.absensi
    ADD CONSTRAINT absensi_pkey PRIMARY KEY (id);


--
-- TOC entry 3258 (class 2606 OID 172359)
-- Name: accessright accessright_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accessright
    ADD CONSTRAINT accessright_pkey PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 172361)
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id);


--
-- TOC entry 3266 (class 2606 OID 172363)
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- TOC entry 3268 (class 2606 OID 172365)
-- Name: detailorders delivery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detailorders
    ADD CONSTRAINT delivery_pkey PRIMARY KEY (id);


--
-- TOC entry 3270 (class 2606 OID 172367)
-- Name: employee emplyoee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT emplyoee_pkey PRIMARY KEY (id);


--
-- TOC entry 3272 (class 2606 OID 172369)
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- TOC entry 3274 (class 2606 OID 172371)
-- Name: ordercolour ordercolour_colourcode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordercolour
    ADD CONSTRAINT ordercolour_colourcode_key UNIQUE (colourcode);


--
-- TOC entry 3276 (class 2606 OID 172373)
-- Name: ordercolour ordercolour_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordercolour
    ADD CONSTRAINT ordercolour_pkey PRIMARY KEY (id);


--
-- TOC entry 3278 (class 2606 OID 172375)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3280 (class 2606 OID 172377)
-- Name: temporaryorder temporaryorder_orderid_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temporaryorder
    ADD CONSTRAINT temporaryorder_orderid_key UNIQUE (orderid);


--
-- TOC entry 3282 (class 2606 OID 172379)
-- Name: temporaryorder temporaryorder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temporaryorder
    ADD CONSTRAINT temporaryorder_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 172381)
-- Name: type type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_pkey PRIMARY KEY (id);


--
-- TOC entry 3262 (class 2606 OID 172383)
-- Name: type type_typecode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.type
    ADD CONSTRAINT type_typecode_key UNIQUE (typecode);


--
-- TOC entry 3283 (class 2606 OID 172384)
-- Name: absensi absensi_employeeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.absensi
    ADD CONSTRAINT absensi_employeeid_fkey FOREIGN KEY (employeeid) REFERENCES public.employee(id) NOT VALID;


--
-- TOC entry 3284 (class 2606 OID 172389)
-- Name: address address_customerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_customerid_fkey FOREIGN KEY (customerid) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3285 (class 2606 OID 172394)
-- Name: customer customer_accessrightid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_accessrightid_fkey FOREIGN KEY (accessrightid) REFERENCES public.accessright(id) NOT VALID;


--
-- TOC entry 3286 (class 2606 OID 172399)
-- Name: employee employee_accessrightid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_accessrightid_fkey FOREIGN KEY (accessrightid) REFERENCES public.accessright(id) NOT VALID;


--
-- TOC entry 3289 (class 2606 OID 172404)
-- Name: temporaryorder fk811ocficc1xvwkmb4v61j2uun; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temporaryorder
    ADD CONSTRAINT fk811ocficc1xvwkmb4v61j2uun FOREIGN KEY (colourid) REFERENCES public.ordercolour(id);


--
-- TOC entry 3287 (class 2606 OID 172409)
-- Name: item item_employeeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_employeeid_fkey FOREIGN KEY (employeeid) REFERENCES public.employee(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- TOC entry 3288 (class 2606 OID 172414)
-- Name: item item_typeid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_typeid_fkey FOREIGN KEY (typeid) REFERENCES public.type(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


-- Completed on 2024-07-02 21:39:27

--
-- PostgreSQL database dump complete
--

