import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { baseRequest } from "@/api/api";

const ClassroomsContext = createContext(null);

const fetchClassrooms = async () => {
    const res = await baseRequest({
        url: "/academics/classrooms/",
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch classrooms");
    }

    return res.data;
};

export const ClassroomsProvider = ({ children }) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["classrooms"],
        queryFn: fetchClassrooms,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const classOptions = useMemo(() => {
        if (!data?.results) return [];
        return data.results.map((classroom) => ({
            label: `Class ${classroom.name}`,
            value: classroom.name,
            id: classroom.id,
        }));
    }, [data]);

    const allSectionOptions = useMemo(() => {
        if (!data?.results) return [];

        const sectionsSet = new Set();
        data.results.forEach((classroom) => {
            (classroom.sections || []).forEach((section) => {
                if (section.is_active) {
                    sectionsSet.add(section.name);
                }
            });
        });

        return Array.from(sectionsSet)
            .sort()
            .map((name) => ({
                label: `Section ${name}`,
                value: name,
            }));
    }, [data]);

    const getSectionsForClass = (className) => {
        if (!data?.results || !className) return [];

        const classroom = data.results.find((c) => c.name === className);
        if (!classroom) return [];

        return (classroom.sections || [])
            .filter((s) => s.is_active)
            .map((section) => ({
                label: `Section ${section.name}`,
                value: section.name,
                id: section.id,
            }));
    };

    const getSectionsForClassById = (classId) => {
        if (!data?.results || !classId) return [];

        const classroom = data.results.find((c) => c.id === classId);
        if (!classroom) return [];

        return (classroom.sections || [])
            .filter((s) => s.is_active)
            .map((section) => ({
                label: `Section ${section.name}`,
                value: section.name,
                id: section.id,
            }));
    };

    const value = {
        classrooms: data?.results || [],
        classOptions,
        allSectionOptions,
        getSectionsForClass,
        getSectionsForClassById,
        refetch,
        isLoading,
        error,
    };

    return (
        <ClassroomsContext.Provider value={value}>
            {children}
        </ClassroomsContext.Provider>
    );
};

export const useClassrooms = () => {
    const context = useContext(ClassroomsContext);
    if (!context) {
        throw new Error("useClassrooms must be used within a ClassroomsProvider");
    }
    return context;
};

export default ClassroomsContext;
