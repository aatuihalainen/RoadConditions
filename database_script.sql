--
-- PostgreSQL database dump
--

\restrict i0ES6rB9g37a5dIQT2uhiVQW6Gt8GV30qyOFfaalqhZe8xQFpCVvI1IdYQOCjg9

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2026-01-02 10:57:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 8 (class 2615 OID 17471)
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- TOC entry 6093 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 6094 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- TOC entry 3 (class 3079 OID 17472)
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- TOC entry 6095 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 235 (class 1259 OID 17717)
-- Name: cameras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cameras (
    camera_id character varying(50) NOT NULL,
    preset_id character varying(50) NOT NULL,
    camera_name character varying(50),
    geom public.geometry(Point,4326) NOT NULL
);


ALTER TABLE public.cameras OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17667)
-- Name: stations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stations (
    id bigint NOT NULL,
    name text,
    geom public.geography(Point,4326) NOT NULL
);


ALTER TABLE public.stations OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 17687)
-- Name: weather_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weather_data (
    station_id bigint NOT NULL,
    air_temp_c real,
    road_temp_c real,
    avg_wind_ms real,
    rain_state text,
    rain_mm_per_h real,
    rain_type text,
    visibility_km real,
    salt_amount_gm2 real,
    water_on_road_mm real,
    snow_on_road_mm real,
    ice_on_road_mm real
);


ALTER TABLE public.weather_data OWNER TO postgres;

--
-- TOC entry 5935 (class 2606 OID 17726)
-- Name: cameras cameras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cameras
    ADD CONSTRAINT cameras_pkey PRIMARY KEY (camera_id);


--
-- TOC entry 5931 (class 2606 OID 17675)
-- Name: stations stations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stations
    ADD CONSTRAINT stations_pkey PRIMARY KEY (id);


--
-- TOC entry 5933 (class 2606 OID 17694)
-- Name: weather_data weather_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weather_data
    ADD CONSTRAINT weather_data_pkey PRIMARY KEY (station_id);


-- Completed on 2026-01-02 10:57:25

--
-- PostgreSQL database dump complete
--

\unrestrict i0ES6rB9g37a5dIQT2uhiVQW6Gt8GV30qyOFfaalqhZe8xQFpCVvI1IdYQOCjg9

